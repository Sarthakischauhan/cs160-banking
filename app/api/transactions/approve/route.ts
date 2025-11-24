import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";
import { Decimal } from "@prisma/client/runtime/library";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const role = getRole(session);
    if (!role.includes("Admin")) {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    const { transaction_id } = await req.json();
    if (!transaction_id) {
      return NextResponse.json(
        { message: "transaction_id required" },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: { transaction_id },
    });

    if (!tx) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (tx.transaction_status === "COMPLETED") {
      return NextResponse.json(
        { message: "Transaction already completed/approved" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (txDB) => {
      console.log(">> STARTING APPROVE FOR", transaction_id);

      // Fetch source account
      const sourceAccount = await txDB.account.findUnique({
        where: { account_id: tx.account_id },
      });
      if (!sourceAccount) throw new Error("Source account not found");

      let sourceNewBalance = sourceAccount.balance;
      let targetNewBalance: Decimal | null = null;

      switch (tx.transaction_type) {
        case "DEPOSIT":
          sourceNewBalance = sourceAccount.balance.add(tx.amount);
          break;

        case "WITHDRAWAL":
          sourceNewBalance = sourceAccount.balance.sub(tx.amount);
          if (sourceNewBalance.lt(0)) {
            throw new Error(
              "Cannot cancel transaction: would result in negative balance"
            );
          }
          break;

        case "TRANSFER":
          sourceNewBalance = sourceAccount.balance.sub(tx.amount);

          if (sourceNewBalance.lt(0)) {
            throw new Error(
              "Cannot approve transfer: insufficient funds in source account"
            );
          }

          if (tx.account_id2 && tx.account_id2 !== tx.account_id) {
            const targetAccount = await txDB.account.findUnique({
              where: { account_id: tx.account_id2 },
            });
            if (!targetAccount) throw new Error("Target account not found");

            targetNewBalance = targetAccount.balance.add(tx.amount);

            await txDB.account.update({
              where: { account_id: tx.account_id2 },
              data: { balance: targetNewBalance },
            });
            console.log(">> TARGET BALANCE UPDATED", {
              before: targetAccount.balance.toString(),
              after: targetNewBalance.toString(),
            });
          }
          break;

        default:
          throw new Error(`Unknown transaction type: ${tx.transaction_type}`);
      }

      // Update source account balance

      await txDB.account.update({
        where: { account_id: tx.account_id },
        data: { balance: sourceNewBalance },
      });

      await txDB.transaction.update({
        where: {transaction_id: tx.transaction_id},
        data: { amount_after_transaction: sourceNewBalance}
      })

      console.log(">> SOURCE BALANCE UPDATED", {
        before: sourceAccount.balance.toString(),
        after: sourceNewBalance.toString(),
      });

      // Mark transaction canceled
      await txDB.transaction.update({
        where: { transaction_id },
        data: { transaction_status: "COMPLETED" },
      });

      console.log(">> TRANSACTION APPROVED SUCCESSFULLY");
    });

    return NextResponse.json(
      { message: "Transaction approved and balances updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return NextResponse.json(
      { message: "Failed to approve transaction", error: error?.message },
      { status: 500 }
    );
  }
});
