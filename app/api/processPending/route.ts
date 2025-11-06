import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

// Process only PENDING transactions for the given customer_id
export async function POST(request: NextRequest) {
  try {
    const { customer_id } = await request.json();
    if (!customer_id) {
      return NextResponse.json({ error: "Missing customer_id" }, { status: 400 });
    }

    // Find the customer
    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // Get all accounts for this customer
    const accounts = await prisma.account.findMany({
      where: { customer_id },
      select: { account_id: true },
    });

    const accountIds = accounts.map((a) => a.account_id);
    if (accountIds.length === 0) {
      return NextResponse.json({ message: "No accounts found for customer" }, { status: 404 });
    }

    // Find all PENDING transactions
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        account_id: { in: accountIds },
        transaction_status: "PENDING",
      },
    });

    if (pendingTransactions.length === 0) {
      return NextResponse.json({ message: "No pending transactions for your accounts" }, { status: 200 });
    }

    let processedCount = 0;

    for (const tx of pendingTransactions) {
      const { account_id, account_id2, amount, transaction_id } = tx;

      // Skip if account_id2 is null
      if (!account_id2) {
        console.warn(`⚠️ Skipping transaction ${transaction_id}: invalid receiver account`);
        continue;
      }

      const sender = await prisma.account.findUnique({ where: { account_id } });
      const receiver = await prisma.account.findUnique({ where: { account_id: account_id2 } });

      if (!sender || !receiver) {
        console.warn(`⚠️ Skipping invalid transaction ${transaction_id}`);
        continue;
      }

      const senderBalance = sender.balance ?? 0;
      const txAmount = amount ?? 0;

      if (senderBalance < txAmount) {
        console.warn(`⚠️ Skipping ${transaction_id}: insufficient funds`);
        continue;
      }

      // Try to find the paired transaction (e.g., the other side of the transfer)
      const pairedTx = await prisma.transaction.findFirst({
        where: {
          account_id: account_id2,
          account_id2: account_id,
          amount: txAmount,
          transaction_status: "PENDING",
        },
      });

      // Build the array of PrismaPromises
      const transactionUpdates = [
        prisma.account.update({
          where: { account_id },
          data: { balance: { decrement: txAmount } },
        }),
        prisma.account.update({
          where: { account_id: account_id2 },
          data: { balance: { increment: txAmount } },
        }),
        prisma.transaction.update({
          where: { transaction_id },
          data: {
            transaction_status: "COMPLETED",
            amount_after_transaction: Number(senderBalance) - Number(txAmount),
          },
        }),
      ];

      // Only add paired transaction update if it exists
      if (pairedTx) {
        transactionUpdates.push(
          prisma.transaction.update({
            where: { transaction_id: pairedTx.transaction_id },
            data: {
              transaction_status: "COMPLETED",
              amount_after_transaction: Number(senderBalance) - Number(txAmount),
            },
          })
        );
      }

      // Run the atomic transaction
      await prisma.$transaction(transactionUpdates);

      processedCount++;
    }

    return NextResponse.json(
      { message: `✅ Processed ${processedCount} pending transaction(s)` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing pending transactions:", error);
    return NextResponse.json(
      { message: "Failed to process pending transactions" },
      { status: 500 }
    );
  }
}
