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
        const { account_id, amount, description, transaction_type } = body || {};
        

        if (amount <= 0) {
            return NextResponse.json({ message: "amount must be positive" }, { status: 400 });
        }

        // Ensure account belongs to user
        const account = await prisma.account.findUnique({ where: { account_id } });
        if (!account || account.customer_id !== customer.customer_id) {
            return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }

        if (balance - amount < 0 ){
            return NextResponse.json({ message: "not enough in balance to give this amount" }, { status: 400 });
        }


        let temp = ""
        if (transaction_type === "immediate"){
            temp = "COMPLETED"
        } else if (transaction_type === "scheduled"){
            temp = "PENDING"
        }

      
        const createdTransaction = await prisma.transaction.create({
            data: {
                account_id,
                account_id2,
                amount,
                amount_after_transaction: balance - amount,
                description,
                created_at: new Date(),
                transaction_status: "COMPLETED",
                transaction_type: "DEPOSIT",
            },
        });

        const createdTransaction2 = await prisma.transaction.create({
            data: {
                account_id: account_id2,
                account_id2: account_id,
                amount,
                amount_after_transaction: amount,
                description,
                created_at: new Date(),
                transaction_status: "COMPLETED",
                transaction_type: "WITHDRAWAL",
            },
        });

        const updatedTransaction = await prisma.account.update({
            where: { account_id : account_id},
            data: {
            balance: {
            increment: -amount, // decreases existing balance by amount
        },
        },
        });

        const updatedTransaction2 = await prisma.account.update({
            where: { account_id : account_id2 },
            data: {
            balance: {
            increment: amount, // increases existing balance by amount
        },
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