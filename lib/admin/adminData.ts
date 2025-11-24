"use server";

import { prisma } from "@/prisma/prisma";
import {
  AccountType,
  DepositTest,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import {
  calculateBalanceHistory,
  calculateTransactionHistory,
} from "./history";
import { isValidUUID } from "../utils";

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

  if (searchParams.id && isValidUUID(searchParams.id)) {
    where.transaction_id = searchParams.id
  }

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

  const deposits2 = await prisma.transaction.findMany({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
      transaction_type: "DEPOSIT",
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      account_id: true,
      created_at: true,
      amount: true,
      description: true,
      transaction_id: true,
    },
  });

  const depositsRenamed = deposits2.map((d) => ({
    account_id: d.account_id,
    created_at: d.created_at,
    amount: d.amount,
    description: d.description,
    transactionId: d.transaction_id,
  }));

  const merged = [...deposits, ...depositsRenamed].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const balances = calculateBalanceHistory(
    merged,
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

export async function getAccounts(
  searchParams: { [key: string]: string | undefined },
  cursor?: string, // The transactionId of the last item from the previous page
  pageSize: number = 20 // Number of items per page
) {
  const limit = pageSize;

  const accountData = await prisma.account.findMany({
    where: {
      ...(searchParams.id && isValidUUID(searchParams.id)
        ? {
            account_id: searchParams.id,
          }
        : {}),
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

export async function getNotifications(
  params: {
    [key: string]: string | undefined;
  },
  cursor?: string,
  pageSize: number = 20
) {
  const where: any = {};
  const limit = pageSize;

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
    take: limit,
    ...(cursor
      ? {
          cursor: { id: Number(cursor) },
          skip: 1, // skip the cursor itself
        }
      : {}),
  });
  return notifications;
}
