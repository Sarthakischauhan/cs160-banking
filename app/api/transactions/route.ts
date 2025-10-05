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
        const { account_id, amount, transaction_type } = body || {};
        if (!account_id || typeof amount !== "number" || !transaction_type) {
            return NextResponse.json({ message: "account_id, amount (number), transaction_type required" }, { status: 400 });
        }
        if (!["deposit", "withdraw"].includes(String(transaction_type).toLowerCase())) {
            return NextResponse.json({ message: "transaction_type must be deposit or withdraw" }, { status: 400 });
        }
        if (amount <= 0) {
            return NextResponse.json({ message: "amount must be positive" }, { status: 400 });
        }

        // Ensure account belongs to user
        const account = await prisma.account.findUnique({ where: { account_id } });
        if (!account || account.customer_id !== customer.customer_id) {
            return NextResponse.json({ message: "Account not found" }, { status: 404 });
        }

        const isWithdraw = String(transaction_type).toLowerCase() === "withdraw";

        const result = await prisma.$transaction(async (tx) => {
            const fresh = await tx.account.findUniqueOrThrow({ where: { account_id } });
            const currentBalance = Number(fresh.balance);
            const nextBalance = isWithdraw ? currentBalance - amount : currentBalance + amount;
            if (nextBalance < 0) {
                throw new Error("Insufficient funds");
            }

            const updated = await tx.account.update({
                where: { account_id },
                data: { balance: nextBalance },
            });

            const createdTx = await tx.transaction.create({
                data: {
                    account_id,
                    amount,
                    amount_after_transaction: nextBalance,
                    transaction_status: "success",
                    customer_id: customer.customer_id,
                    transaction_type: isWithdraw ? "withdraw" : "deposit",
                },
            });

            return { updated, createdTx };
        });

        return NextResponse.json(result.createdTx, { status: 201 });
    } catch (error: any) {
        if (error?.message === "Insufficient funds") {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to create transaction" }, { status: 500 });
    }
});