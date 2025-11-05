"use server";

import { prisma } from "@/prisma/prisma";
import { Transaction, TransactionType } from "@prisma/client";

export async function getAccountsSummary() {
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

  return {
    count: count,
    totalBalance: overall._sum.balance,
    byType,
  };
}

export async function getCustomerSummary() {
  const count = await prisma.customer.count();
  return {
    count: count,
  };
}

export async function getTransactionSummary() {
  const count = await prisma.transaction.count();
  const types = await prisma.transaction.groupBy({
    by: ["transaction_type"],
    _sum: {
      amount: true,
    },
  });
  return {
    count: count,
    transactionTotal: types,
    transactionHistory: await getAdminTrasactionHistory(),
  };
}

async function getAdminTrasactionHistory() {
  const transactions = await prisma.transaction.findMany({
    where: {
      transaction_type: "DEPOSIT",
    },
    orderBy: { created_at: "asc" },
  });
  const history = calculateTransactionHistory(transactions);

  return history;
}

function calculateTransactionHistory(transactions: Transaction[]) {
  const dateMap = new Map<string, number>();

  for (const t of transactions) {
    const date = t.created_at.toISOString().split("T")[0];
    const currentAmount = dateMap.get(date) || 0;
    dateMap.set(date, currentAmount + Number(t.amount));
  }

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    if (!dateMap.has(key)) {
      dateMap.set(key, 0);
    }
  }

  const arr = Array.from(dateMap, ([date, amount]) => ({ date, amount })).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  return arr;
}
