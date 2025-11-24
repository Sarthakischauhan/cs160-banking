import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0 } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findFirst({
      where: { auth0_user_id: session.user.sub },
      select: { customer_id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Bad request: customer not found" },
        { status: 400 }
      );
    }

    // all accounts owned by this user
    const accounts = await prisma.account.findMany({
      where: { customer_id: customer.customer_id },
    });

    if (accounts.length === 0) {
      return NextResponse.json(
        { message: "Bad request: no accounts found" },
        { status: 400 }
      );
    }

    const { from_account_id, to_account_id, amount, description, schedule_date  } = await req.json();

    if (!from_account_id || !to_account_id || !amount || !description) {
      return NextResponse.json(
        { message: "Bad request: missing fields" },
        { status: 400 }
      );
    }

    // validate sender account is user's own account
    const fromAccount = accounts.find(
      (acc) => acc.account_id === from_account_id
    );

    if (!fromAccount) {
      return NextResponse.json(
        { message: "Invalid user account: cannot transfer from account not owned" },
        { status: 403 }
      );
    }

    if (fromAccount.account_status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Source account no longer active" },
        { status: 403 }
      );
    }

    // validate receiving account exists (can belong to another customer)
    const toAccount = await prisma.account.findUnique({
      where: { account_id: to_account_id },
    });

    if (!toAccount) {
      return NextResponse.json(
        { message: "Receiving account does not exist" },
        { status: 400 }
      );
    }

    if (toAccount.account_status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Destination account not active" },
        { status: 403 }
      );
    }

    // balance check
    if (fromAccount.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient funds" },
        { status: 400 }
      );
    }

    // MAIN TRANSFER TRANSACTION BLOCK
    const result = await prisma.$transaction(async (tx) => {

      const scheduled2 = schedule_date ? new Date(schedule_date) : null;
      const txn = await tx.transaction.create({
        data: {
          account_id: fromAccount.account_id,
          account_id2: toAccount.account_id,
          description: description,
          transaction_status: "PENDING",
          transaction_type: "TRANSFER",
          amount: amount,
          scheduled: scheduled2
        },
      });

      return txn;
    });

    return NextResponse.json(
      {
        message: "Transfer successful",
        transaction: result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Transfer API Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err?.message },
      { status: 500 }
    );
  }
});
