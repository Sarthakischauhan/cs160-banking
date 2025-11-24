"use server";

import { prisma } from "@/prisma/prisma";

export type RecentTransferUser = {
  id: string;
  name: string;
  accountNumber: string;
  email: string | null;
  lastTransferred: string;
};

export async function getRecentTransactions({
  account_id,
}: {
  account_id: string;
}): Promise<RecentTransferUser[]> {
  if (!account_id) return [];

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ account_id }, { account_id2: account_id }],
      transaction_type: "TRANSFER",
    },
    orderBy: {
      created_at: "desc",
    },
    take: 20,
    select: {
      transaction_id: true,
      created_at: true,
      account_id: true,
      account_id2: true,
      Account: {
        select: {
          account_id: true,
          Customer: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      },
      Account_Transaction_account_id2ToAccount: {
        select: {
          account_id: true,
          Customer: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const seenAccounts = new Set<string>();
  const recentUsers: RecentTransferUser[] = [];

  const buildName = (
    first?: string | null,
    last?: string | null,
    email?: string | null,
  ) => {
    const parts = [first, last].filter(Boolean) as string[];
    if (parts.length > 0) {
      return parts.join(" ");
    }
    return email ?? "Unknown User";
  };

  for (const transaction of transactions) {
    const isSender = transaction.account_id === account_id;
    const counterpart = isSender
      ? transaction.Account_Transaction_account_id2ToAccount
      : transaction.Account;

    if (!counterpart) {
      continue;
    }

    const counterpartId = counterpart.account_id;
    if (!counterpartId || seenAccounts.has(counterpartId)) {
      continue;
    }

    seenAccounts.add(counterpartId);

    const customer = counterpart.Customer;
    recentUsers.push({
      id: counterpartId,
      name: buildName(
        customer?.first_name,
        customer?.last_name,
        customer?.email,
      ),
      accountNumber: counterpartId,
      email: customer?.email ?? null,
      lastTransferred: transaction.created_at.toISOString(),
    });

    if (recentUsers.length === 4) {
      break;
    }
  }

  return recentUsers;
}
