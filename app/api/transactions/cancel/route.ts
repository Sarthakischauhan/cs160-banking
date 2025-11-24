import { Decimal } from "@prisma/client/runtime/library";
import { type NextRequest, NextResponse } from "next/server";
import { auth0, getRole } from "@/lib/auth0";
import { prisma } from "@/prisma/prisma";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const role = getRole(session);
    if (!role.includes("Admin")) {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 },
      );
    }

    const { transaction_id } = await req.json();
    if (!transaction_id) {
      return NextResponse.json(
        { message: "transaction_id required" },
        { status: 400 },
      );
    }

    // Fetch original transaction
    const tx = await prisma.transaction.findUnique({
      where: { transaction_id },
    });

    if (!tx)
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    if (tx.transaction_status === "CANCELED") {
      return NextResponse.json(
        { message: "Transaction already cancelled" },
        { status: 400 },
      );
    }

    // Reverse logic
    const reverseType =
      tx.transaction_type === "DEPOSIT" ? "WITHDRAWAL" : "DEPOSIT";
    const reverseAmount = tx.amount;

    // Reverse balances
    await prisma.$transaction(async (txDB) => {
      // Reverse the source account
      const sourceAccount = await txDB.account.findUnique({
        where: { account_id: tx.account_id },
      });
      if (!sourceAccount) throw new Error("Source account not found");

      const sourceNewBalance =
        tx.transaction_type === "DEPOSIT"
          ? sourceAccount.balance.minus(tx.amount)
          : sourceAccount.balance.plus(tx.amount);

      await txDB.account.update({
        where: { account_id: tx.account_id },
        data: { balance: sourceNewBalance },
      });

      // If transfer, reverse second account
      if (tx.account_id2) {
        const targetAccount = await txDB.account.findUnique({
          where: { account_id: tx.account_id2 },
        });
        if (!targetAccount) throw new Error("Target account not found");

        const targetNewBalance =
          tx.transaction_type === "DEPOSIT"
            ? targetAccount.balance.plus(tx.amount)
            : targetAccount.balance.minus(tx.amount);

        await txDB.account.update({
          where: { account_id: tx.account_id2 },
          data: { balance: targetNewBalance },
        });
      }

      // Mark transaction cancelled
      await txDB.transaction.update({
        where: { transaction_id },
        data: { transaction_status: "CANCELED" },
      });

      // Compensating transaction only if transfer
      if (tx.account_id2) {
        await txDB.transaction.create({
          data: {
            account_id: tx.account_id2,
            account_id2: tx.account_id,
            amount: tx.amount,
            description: `Reversal of transaction ${transaction_id}`,
            transaction_type: reverseType,
            transaction_status: "COMPLETED",
          },
        });
      }
    });

    return NextResponse.json(
      { message: "Transaction cancelled successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to cancel transaction" },
      { status: 500 },
    );
  }
});
