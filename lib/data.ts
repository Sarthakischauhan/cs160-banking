"use server";

import { prisma } from "@/prisma/prisma";
import { DepositTest, Transaction, TransactionType } from "@prisma/client";

const timeFrameOptions = {
  month: 30,
  year: 365,
};

export async function getAccountsSummary(timeFrame: "month" | "year") {
  const [count, overall, byType] = await Promise.all([
    prisma.account.count(),
    prisma.account.aggregate({
      _sum: { balance: true },
    }),
    prisma.account.groupBy({
      by: ["account_type"],
      _count: { _all: true },
      _sum: { balance: true },
    }),
  ]);

  const start = new Date();
  const end = new Date();
  start.setDate(end.getDate() - timeFrameOptions[timeFrame]);

  const deposits = await prisma.depositTest.findMany({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { created_at: "asc" },
  });

  const balances = calculateBalanceHistory(
    deposits,
    Number(overall._sum.balance)
  );

  return {
    count: count,
    totalBalance: overall._sum.balance,
    byType,
    balanceHistory: balances,
  };
}

export async function getCustomerSummary() {
  const count = await prisma.customer.count();
  return {
    count: count,
  };
}

export async function getTransactionSummary(timeFrame: "month" | "year") {
  const start = new Date();
  const end = new Date();
  start.setDate(end.getDate() - timeFrameOptions[timeFrame]);

  const count = await prisma.transaction.count();

  const types = await prisma.transaction.groupBy({
    by: ["transaction_type"],
    _sum: {
      amount: true,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      transaction_type: "DEPOSIT",
      created_at: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { created_at: "asc" },
  });

  const history = calculateTransactionHistory(transactions, start, end);
  return {
    count: count,
    transactionTotal: types,
    transactionHistory: history,
  };
}

function calculateTransactionHistory(
  transactions: Transaction[],
  start: Date,
  end: Date
) {
  // Pre-fill the map with all dates in the range
  const dateMap = new Map<string, number>();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    dateMap.set(dateStr, 0);
  }

  // Sum transaction amounts
  for (const t of transactions) {
    const dateStr = t.created_at.toISOString().split("T")[0];
    if (dateMap.has(dateStr)) {
      dateMap.set(dateStr, dateMap.get(dateStr)! + Number(t.amount));
    }
  }

  // Convert map to sorted array
  const arr: { date: string; amount: number }[] = [];
  for (const [date, amount] of dateMap) {
    arr.push({ date, amount });
  }

  return arr;
}

function calculateBalanceHistory(
  deposits: DepositTest[],
  currentBalance: number
) {
  // 1. Aggregate amounts per day
  const dailyTotals = new Map<string, number>();

  for (const t of deposits) {
    const date = t.created_at.toISOString().split("T")[0]; // YYYY-MM-DD
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + Number(t.amount));
  }

  // 2. Get all dates sorted ascending
  const dates = Array.from(dailyTotals.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 3. Work backward from current balance
  let amount = currentBalance;
  const history: { date: string; amount: number }[] = [];

  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    history.push({ date, amount });
    amount -= dailyTotals.get(date)!; // reverse the transactions
  }

  return history.reverse(); // oldest date first
}
