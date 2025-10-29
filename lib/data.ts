"use server";

import { prisma } from "@/prisma/prisma";
import { TransactionType } from "@prisma/client";

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

  return { count: count, totalBalance: overall._sum.balance, byType };
}

export async function getCustomerSummary() {
  const count = await prisma.customer.count();
  return {
    count: count,
  };
}

export async function getTransactionSummary () {
    const count = await prisma.transaction.count()
    const types = await prisma.transaction.groupBy({
        by:['transaction_type'],
        _sum: {
            amount: true
        }
    })
    return {
        count: count,
        transactionTotal: types
    }
}
