import { TransactionStatus, TransactionType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

const ACCOUNT_ID = "e73e1cad-c501-49c2-97b9-ef0ed66f3c90";

// Realistic transaction descriptions
const withdrawalDescriptions = [
  "ATM Withdrawal",
  "Grocery Store Purchase",
  "Gas Station",
  "Coffee Shop",
  "Restaurant",
  "Amazon Purchase",
  "Target",
  "Walmart",
  "Starbucks",
  "Netflix Subscription",
  "Spotify Subscription",
  "Electric Bill",
  "Water Bill",
  "Internet Bill",
  "Phone Bill",
  "Uber Ride",
  "Lyft Ride",
  "Movie Theater",
  "Pharmacy",
  "Gas Station - Shell",
  "Whole Foods",
  "Trader Joe's",
  "Costco",
  "Best Buy",
  "Home Depot",
  "CVS Pharmacy",
  "Walgreens",
  "McDonald's",
  "Subway",
  "Pizza Delivery",
];

const depositDescriptions = [
  "Salary Deposit",
  "Paycheck",
  "Direct Deposit",
  "Transfer from Savings",
  "Refund",
  "Tax Refund",
  "Freelance Payment",
  "Bonus",
  "Cash Deposit",
  "Bank Transfer",
];

const transferDescriptions = [
  "Transfer to Savings",
  "Transfer to Checking",
  "Payment to Friend",
  "Bill Payment",
  "Rent Payment",
  "Loan Payment",
];

// Helper function to get a random element from an array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get a random number between min and max
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Helper function to get a random date in a month
function randomDateInMonth(year: number, month: number): Date {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return new Date(year, month, day, hour, minute);
}

export async function GET(req: NextRequest) {
  try {
    // Check if account exists
    const account = await prisma.account.findUnique({
      where: { account_id: ACCOUNT_ID },
    });

    if (!account) {
      return NextResponse.json(
        { message: `Account with ID ${ACCOUNT_ID} not found!` },
        { status: 404 },
      );
    }

    `Found account: ${ACCOUNT_ID}`;
    `Current balance: ${account.balance}`;

    // Get all existing transactions for this account to calculate starting balance
    const existingTransactions = await prisma.transaction.findMany({
      where: { account_id: ACCOUNT_ID },
      orderBy: { created_at: "asc" },
    });

    // Calculate current balance from transactions if needed
    let currentBalance = Number(account.balance);

    // If we have existing transactions, use the last one's amount_after_transaction
    if (existingTransactions.length > 0) {
      const lastTransaction =
        existingTransactions[existingTransactions.length - 1];
      if (lastTransaction.amount_after_transaction) {
        currentBalance = Number(lastTransaction.amount_after_transaction);
      }
    }

    `Starting balance for transactions: ${currentBalance}`;

    // Get other accounts for transfers (we'll need to find another account or create a dummy one)
    const otherAccounts = await prisma.account.findMany({
      where: {
        account_id: { not: ACCOUNT_ID },
      },
      take: 5,
    });

    const transferAccountId =
      otherAccounts.length > 0 ? otherAccounts[0].account_id : null;

    // Generate transactions for the past 6 months
    const now = new Date();
    const transactions: any[] = [];
    let runningBalance = currentBalance;

    // Generate transactions for each month (going back 6 months)
    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const year = now.getFullYear();
      const month = now.getMonth() - monthOffset;
      const adjustedMonth = month < 0 ? month + 12 : month;
      const adjustedYear = month < 0 ? year - 1 : year;

      `\nGenerating transactions for ${new Date(adjustedYear, adjustedMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;

      // Generate 2-5 deposits per month
      const numDeposits = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numDeposits; i++) {
        const date = randomDateInMonth(adjustedYear, adjustedMonth);
        const amount = Math.round(randomBetween(500, 3000) * 100) / 100; // Between $500 and $3000
        runningBalance += amount;

        transactions.push({
          account_id: ACCOUNT_ID,
          amount: amount,
          created_at: date,
          amount_after_transaction: Math.round(runningBalance * 100) / 100,
          description: randomElement(depositDescriptions),
          transaction_status: TransactionStatus.COMPLETED,
          transaction_type: TransactionType.DEPOSIT,
        });
      }

      // Generate 8-15 withdrawals per month
      const numWithdrawals = Math.floor(Math.random() * 8) + 8;
      for (let i = 0; i < numWithdrawals; i++) {
        const date = randomDateInMonth(adjustedYear, adjustedMonth);
        // Ensure we don't go negative
        const maxWithdrawal = runningBalance - 100; // Keep at least $100
        if (maxWithdrawal <= 0) {
          // Add a deposit first if balance is too low
          const depositAmount =
            Math.round(randomBetween(500, 1500) * 100) / 100;
          runningBalance += depositAmount;
          transactions.push({
            account_id: ACCOUNT_ID,
            amount: depositAmount,
            created_at: new Date(date.getTime() - 3600000), // 1 hour earlier
            amount_after_transaction: Math.round(runningBalance * 100) / 100,
            description: randomElement(depositDescriptions),
            transaction_status: TransactionStatus.COMPLETED,
            transaction_type: TransactionType.DEPOSIT,
          });
        }

        const amount =
          Math.round(randomBetween(10, Math.min(maxWithdrawal, 500)) * 100) /
          100;
        runningBalance -= amount;

        transactions.push({
          account_id: ACCOUNT_ID,
          amount: amount,
          created_at: date,
          amount_after_transaction: Math.round(runningBalance * 100) / 100,
          description: randomElement(withdrawalDescriptions),
          transaction_status: TransactionStatus.COMPLETED,
          transaction_type: TransactionType.WITHDRAWAL,
        });
      }

      // Generate 1-3 transfers per month (if we have another account)
      if (transferAccountId) {
        const numTransfers = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numTransfers; i++) {
          const date = randomDateInMonth(adjustedYear, adjustedMonth);
          const maxTransfer = runningBalance - 100;
          if (maxTransfer > 0) {
            const amount =
              Math.round(randomBetween(50, Math.min(maxTransfer, 500)) * 100) /
              100;
            runningBalance -= amount;

            transactions.push({
              account_id: ACCOUNT_ID,
              account_id2: transferAccountId,
              amount: amount,
              created_at: date,
              amount_after_transaction: Math.round(runningBalance * 100) / 100,
              description: randomElement(transferDescriptions),
              transaction_status: TransactionStatus.COMPLETED,
              transaction_type: TransactionType.TRANSFER,
            });
          }
        }
      }
    }

    // Sort transactions by date
    transactions.sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime(),
    );

    // Recalculate balance_after_transaction based on sorted order
    let recalculatedBalance = currentBalance;
    transactions.forEach((transaction) => {
      if (transaction.transaction_type === TransactionType.DEPOSIT) {
        recalculatedBalance += transaction.amount;
      } else if (
        transaction.transaction_type === TransactionType.WITHDRAWAL ||
        transaction.transaction_type === TransactionType.TRANSFER
      ) {
        recalculatedBalance -= transaction.amount;
      }
      transaction.amount_after_transaction =
        Math.round(recalculatedBalance * 100) / 100;
    });

    `\nGenerated ${transactions.length} transactions`;
    `Final balance: ${recalculatedBalance}`;
    runningBalance = recalculatedBalance;

    // Insert transactions in batches
    const batchSize = 50;
    let insertedCount = 0;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      const result = await prisma.transaction.createMany({
        data: batch,
        skipDuplicates: true,
      });
      insertedCount += result.count;
      `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transactions.length / batchSize)}`;
    }

    // Update account balance
    await prisma.account.update({
      where: { account_id: ACCOUNT_ID },
      data: { balance: runningBalance },
    });

    return NextResponse.json({
      message: `Successfully populated ${insertedCount} transactions!`,
      transactionsInserted: insertedCount,
      finalBalance: runningBalance,
      accountId: ACCOUNT_ID,
    });
  } catch (error: any) {
    console.error("Error populating transactions:", error);
    return NextResponse.json(
      { message: "Failed to populate transactions", error: error.message },
      { status: 500 },
    );
  }
}
