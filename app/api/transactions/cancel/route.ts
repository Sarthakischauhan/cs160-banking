import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const role = getRole(session);
    if (!role.includes("Admin")) {
      return NextResponse.json({ message: "Forbidden: Admin only" }, { status: 403 });
    }

    const { transaction_id } = await req.json();
    if (!transaction_id) {
      return NextResponse.json({ message: "transaction_id required" }, { status: 400 });
    }

    // Fetch original transaction
    const tx = await prisma.transaction.findUnique({
      where: { transaction_id },
    });

    if (!tx) return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    if (tx.transaction_status === "CANCELED") {
      return NextResponse.json({ message: "Transaction already cancelled" }, { status: 400 });
    }

    // Reverse logic
    const reverseType = tx.transaction_type === "DEPOSIT" ? "WITHDRAWAL" : "DEPOSIT";
    const reverseAmount = tx.amount;

    // Reverse balances
    await prisma.$transaction([
      prisma.account.update({
        where: { account_id: tx.account_id },
        data: {
          balance: tx.transaction_type === "DEPOSIT"
            ? { decrement: reverseAmount }
            : { increment: reverseAmount }
        }
      }),
      prisma.account.update({
        where: { account_id: tx.account_id2! }, // non-null assertion, ensure your schema makes it required for transfers
        data: {
          balance: tx.transaction_type === "DEPOSIT"
            ? { increment: reverseAmount }
            : { decrement: reverseAmount }
        }
      }),

      // Mark transaction cancelled
      prisma.transaction.update({
        where: { transaction_id },
        data: { transaction_status: "CANCELED" }
      }),

      // Create compensating record
      prisma.transaction.create({
        data: {
          account_id: tx.account_id2!,
          account_id2: tx.account_id,
          amount: reverseAmount,
          description: `Reversal of transaction ${transaction_id}`,
          transaction_type: reverseType,
          transaction_status: "COMPLETED",
          created_at: new Date()
        }
      })
    ]);

    return NextResponse.json({ message: "Transaction cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to cancel transaction" }, { status: 500 });
  }
});
