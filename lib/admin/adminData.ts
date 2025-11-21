"use server";

import { prisma } from "@/prisma/prisma";
import {
  AccountType,
  DepositTest,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

const timeFrameOptions = {
  month: 30,
  year: 365,
};

export async function getTransactions(
  searchParams: { [key: string]: string | undefined },
  cursor?: string, // The transactionId of the last item from the previous page
  pageSize: number = 20 // Number of items per page
) {
  const where: any = {};

  if (searchParams.minAmount || searchParams.maxAmount) {
    where.amount = {};
    if (searchParams.minAmount)
      where.amount.gte = Number(searchParams.minAmount);
    if (searchParams.maxAmount)
      where.amount.lte = Number(searchParams.maxAmount);
  }

  if (searchParams.minDate || searchParams.maxDate) {
    where.created_at = {};
    if (searchParams.minDate)
      where.created_at.gte = new Date(searchParams.minDate);
    if (searchParams.maxDate)
      where.created_at.lte = new Date(searchParams.maxDate);
  }

  if (searchParams.firstName) {
    where.OR = [
      {
        Account: {
          Customer: {
            first_name: {
              contains: searchParams.firstName,
              mode: "insensitive",
            },
          },
        },
      },
      {
        Account_Transaction_account_id2ToAccount: {
          Customer: {
            first_name: {
              contains: searchParams.firstName,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (searchParams.lastName) {
    where.OR = [
      {
        Account: {
          Customer: {
            last_name: { contains: searchParams.lastName, mode: "insensitive" },
          },
        },
      },
      {
        Account_Transaction_account_id2ToAccount: {
          Customer: {
            last_name: { contains: searchParams.lastName, mode: "insensitive" },
          },
        },
      },
    ];
  }

  if (searchParams.transactionStatus) {
    where.transaction_status =
      searchParams.transactionStatus as TransactionStatus;
  }

  if (searchParams.transactionType) {
    where.transaction_type = searchParams.transactionType as TransactionType;
  }

  const data = await prisma.transaction.findMany({
    where,
    include: {
      Account: { include: { Customer: true } },
      Account_Transaction_account_id2ToAccount: { include: { Customer: true } },
    },
    orderBy: { created_at: "desc" }, // cursor must use a unique field
    take: pageSize + 1, // fetch one extra to check if there’s a next page
    cursor: cursor ? { transaction_id: cursor } : undefined,
    skip: cursor ? 1 : 0, // skip the cursor itself
  });

  // Determine if there is a next page
  const hasNextPage = data.length > pageSize;
  const items = hasNextPage ? data.slice(0, pageSize) : data;

  const result = items.map((t) => ({
    ...t,
    amount: Number(t.amount),
    amount_after_transaction: Number(t.amount_after_transaction),
    Account: { ...t.Account, balance: Number(t.Account.balance) },
    Account_Transaction_account_id2ToAccount: {
      ...t.Account_Transaction_account_id2ToAccount,
      balance: Number(t.Account_Transaction_account_id2ToAccount?.balance),
    },
  }));

  return {
    data: result,
    nextCursor: hasNextPage ? items[items.length - 1].transaction_id : null,
    hasNextPage,
  };
}

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
    Number(overall._sum.balance),
    timeFrameOptions["month"]
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

  // --- Total count of all transactions in the timeframe ---
  const count = await prisma.transaction.count({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });

  // --- Sum of amounts by transaction type ---
  const types = await prisma.transaction.groupBy({
    by: ["transaction_type"],
    _sum: {
      amount: true,
    },
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });

  // --- All deposits for history chart ---
  const deposits = await prisma.transaction.findMany({
    where: {
      transaction_type: "DEPOSIT",
      created_at: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { created_at: "asc" },
  });

  const history = calculateTransactionHistory(deposits, start, end);

  // --- Pending transactions themselves ---
  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      transaction_status: "PENDING",
      created_at: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { created_at: "desc" },
    take: 4,
  });

  return {
    count: count,
    transactionTotal: types,
    transactionHistory: history,
    pendingTransactions: pendingTransactions,
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
  currentBalance: number,
  timeFrame: number
) {
  // 1. Aggregate amounts per day
  const dailyTotals = new Map<string, number>();
  for (const t of deposits) {
    const date = t.created_at.toISOString().split("T")[0]; // YYYY-MM-DD
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + Number(t.amount));
  }

  // 2. Generate all dates in the timeframe
  const history: { date: string; amount: number }[] = [];
  let amount = currentBalance;

  const end = new Date(); // today
  const start = new Date();
  start.setDate(end.getDate() - timeFrame + 1); // include today as last day

  for (let d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
    const dateStr = d.toISOString().split("T")[0];
    history.push({ date: dateStr, amount });
    amount -= dailyTotals.get(dateStr) || 0; // subtract if there was a transaction
  }

  return history.reverse(); // oldest date first
}

export async function getAccounts(
  searchParams: { [key: string]: string | undefined },
  cursor?: string, // The transactionId of the last item from the previous page
  pageSize: number = 20 // Number of items per page
) {
  const limit = pageSize;

  const accountData = await prisma.account.findMany({
    where: {
      ...(searchParams.accountType
        ? { account_type: searchParams.accountType as AccountType }
        : {}),
      ...(searchParams.firstName
        ? {
            Customer: {
              first_name: {
                contains: searchParams.firstName,
                mode: "insensitive",
              },
            },
          }
        : {}),
      ...(searchParams.lastName
        ? {
            Customer: {
              last_name: {
                contains: searchParams.lastName,
                mode: "insensitive",
              },
            },
          }
        : {}),
      ...(searchParams.minBalance || searchParams.maxBalance
        ? {
            balance: {
              gte: searchParams.minBalance
                ? Number(searchParams.minBalance)
                : undefined,
              lte: searchParams.maxBalance
                ? Number(searchParams.maxBalance)
                : undefined,
            },
          }
        : {}),
      ...(searchParams.minDate || searchParams.maxDate
        ? {
            created_at: {
              gte: searchParams.minDate
                ? new Date(searchParams.minDate)
                : undefined,
              lte: searchParams.maxDate
                ? new Date(searchParams.maxDate)
                : undefined,
            },
          }
        : {}),
    },
    include: {
      Customer: true,
      _count: {
        select: { Transaction_Transaction_account_idToAccount: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: limit,
    ...(cursor
      ? {
          cursor: { account_id: cursor },
          skip: 1, // skip the cursor itself
        }
      : {}),
  });

  // Determine the next cursor
  const nextCursor =
    accountData.length > 0
      ? accountData[accountData.length - 1].account_id
      : null;

  return { accounts: accountData, nextCursor };
}

export async function getNotifications(params: {
  [key: string]: string | undefined;
}) {
  const where: any = {};

  if (params.firstName) {
    where.Customer = {
      ...(where.Customer || {}),
      is: {
        ...(where.Customer?.is || {}),
        first_name: {
          contains: params.firstName,
          mode: "insensitive",
        },
      },
    };
  }

  if (params.lastName) {
    where.Customer = {
      ...(where.Customer || {}),
      is: {
        ...(where.Customer?.is || {}),
        last_name: {
          contains: params.lastName,
          mode: "insensitive",
        },
      },
    };
  }

  if (params.notificationType) {
    where.notification_type = params.notificationType;
  }
  if (params.dismissed) {
    where.dismissed = params.dismissed === "True" ? true : false;
  }
  if (params.minDate || params.maxDate) {
    where.created_at = {};
    if (params.minDate) where.created_at.gte = new Date(params.minDate);
    if (params.maxDate) where.created_at.lte = new Date(params.maxDate);
  }

  const notifications = await prisma.notifications.findMany({
    where,
    orderBy: {
      created_at: "desc",
    },
    include: {
      Customer: true,
    },
  });
  return notifications;
}
