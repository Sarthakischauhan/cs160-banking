import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0 } from "@/lib/auth0";

// Create a deposit or withdraw transaction for an account owned by current user
export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        if (!session) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

        const auth0UserId = session.user?.sub || "";
        const customer = await prisma.customer.findUnique({ where: { auth0_user_id: auth0UserId } });
        if (!customer) return NextResponse.json({ message: "Customer not found" }, { status: 400 });

        const body = await req.json();
        const { account_id, balance, amount, description, scheduled } = body || {};
        
        let scheduledDate: Date | null = null;
        if (scheduled) {
            scheduledDate = new Date(scheduled);
            if (isNaN(scheduledDate.getTime())) {
                return NextResponse.json(
                    { message: "Invalid scheduled date" },
                    { status: 400 }
                );
            }
        }

        if (amount <= 0) {
            return NextResponse.json({ message: "amount must be positive" }, { status: 400 });
        }

        // Ensure account belongs to user
        const account = await prisma.account.findUnique({ where: { account_id } });
        if (!account || account.customer_id !== customer.customer_id) {
            return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }


        let temp = "PENDING"
      
        const createdTransaction = await prisma.transaction.create({
            data: {
                account_id,
                account_id2: null,
                amount,
                amount_after_transaction: balance - amount,
                description,
                created_at: new Date(),
                transaction_status: "PENDING",
                transaction_type: "WITHDRAWAL",
                scheduled: scheduledDate,
            },
        });
        
        return NextResponse.json({ message: "Transaction successful" }, { status: 200 });
        } catch (error: any) {
        if (error?.message === "Insufficient funds") {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to create transaction" }, { status: 500 });
    }
});

export const GET = auth0.withApiAuthRequired(async () => {
  try {
    const session = await auth0.getSession();
    if (!session)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const auth0UserId = session.user.sub;

    const customer = await prisma.customer.findUnique({ where: { auth0_user_id: auth0UserId } });


    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // 2. Get all accounts for that customer
    const accounts = await prisma.account.findMany({
      where: { customer_id: customer.customer_id },
      select: { account_id: true },
    });

    if (accounts.length === 0) {
      return NextResponse.json([], { status: 200 }); // No accounts → no payments
    }


    const accountIds = accounts.map((a) => a.account_id);

    // 3. Fetch pending scheduled transactions
    const scheduledPayments = await prisma.transaction.findMany({
      where: {
        account_id: { in: accountIds },
        scheduled: { not: null },
        transaction_status: "PENDING",
      },
      orderBy: { scheduled: "asc" },
    });

    console.log("Scheduled Payments:", scheduledPayments);
    return NextResponse.json(scheduledPayments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching scheduled payments" },
      { status: 500 }
    );
  }
});
