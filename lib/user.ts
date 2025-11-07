"use server";
// fetch data about user status and pass it as context
import type { TransactionStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { cache } from "react"
import Decimal from "decimal.js";


type userDataProps = {
    userId: string;
}

interface userDataReturn{
    firstName: string,
    lastName: string,
    accounts: Array<{
        account_id: string,
        balance: number,
        account_type: string;
    }> ,
    transactions: {
        account_id: string;
        account_id2: string;
        amount: number;
        description: string;
        created_at: Date | null;
        transaction_status: TransactionStatus
    }
    isOnboarded: boolean;
}


const nullUser : userDataReturn = {
    firstName: "", 
    lastName: "", 
    accounts: [],
    transactions: {
        account_id: "",
        account_id2: "",
        amount: 0,
        description: "",
        created_at: null,
        transaction_status: "PENDING"
    },
    isOnboarded: false,
}

export const getUserData = cache(async ({
    userId,
}: userDataProps) => {

    // 1. Customer lookup
    const customerData = await prisma.customer.findFirst({
        where: { auth0_user_id: userId }
    });

    if (!customerData) return nullUser;

    // 2. Accounts lookup
    const accountData = await prisma.account.findMany({
        where: { customer_id: customerData.customer_id },
        select: {
            account_id: true,
            balance: true,
            account_type: true,
        }
    });

    if (!accountData) return nullUser;

    // Convert balances (Decimal → number)
    const accounts = accountData.map((a) => ({
        account_id: a.account_id,
        balance:
            a.balance && typeof (a.balance as any).toNumber === "function"
                ? (a.balance as any).toNumber()
                : Number(a.balance),
        account_type: a.account_type,
    }));

    // 3. Fetch 5 recent transactions per account
    const transactionsMap: Record<string, any[]> = {};

    for (const acc of accounts) {
        const txns = await prisma.transaction.findMany({
            where: {
                OR: [
                    { account_id: acc.account_id },
                    { account_id2: acc.account_id }, // if you support transfers
                ],
            },
            select:{
                account_id: true,
                account_id2: true,
                amount: true,
                description: true,
                created_at: true,
                transaction_status: true,
                transaction_type: true
            },
            orderBy: { created_at: "desc" },
            take: 5,
        });

        // convert decimals in each transaction
        const cleanTxns = txns.map((t) => ({
            ...t,
            amount:
                t.amount &&
                typeof (t.amount as any).toNumber === "function"
                    ? (t.amount as any).toNumber()
                    : Number(t.amount),
        }));

        transactionsMap[acc.account_id] = cleanTxns;
    }

    // 4. Final user object
    const user = {
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        accounts,
        transactions: transactionsMap,
        isOnboarded:
            customerData.first_name && customerData.last_name ? true : false,
    };

    return user;
});



export const handleCurrentId = async (searchParamsAccountId? : string) => {
  if (searchParamsAccountId) {
    // Update cookie to remember this selection
    const cookieStore = await cookies()
    cookieStore.set("currentAccountId", searchParamsAccountId, {
      httpOnly: true,
      sameSite: "lax",
    })
    return searchParamsAccountId
  }

  const cookieStore = await cookies()
  const lastAccountId = cookieStore.get("currentAccountId")?.value
  return lastAccountId ?? null;
}