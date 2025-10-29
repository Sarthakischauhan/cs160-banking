"use server";
// fetch data about user status and pass it as context
import type { Transaction, Account } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { cache } from "react"
import Decimal from "decimal.js";


type userDataProps = {
    userId: string;
    // accountId?: string;
    // customerId?: string
}

interface SerializedTransaction {
  id: string;
  account_id: string | null;
  account_id2: string | null;
  amount: number | string;
  created_at: string | null;
  // add other fields you rely on as needed
  [key: string]: any;
}

interface userDataReturn{
    firstName: string,
    lastName: string,
    accounts: Array<{
        account_id: string,
        balance: number,
        account_type: string;
    }> ,
    isOnboarded: boolean;
    transactions: SerializedTransaction[]
}


const nullUser : userDataReturn = {
    firstName: "", 
    lastName: "", 
    accounts: [],
    isOnboarded: false,
    transactions: [],
}

export const getUserData = cache(async ({
    userId, 
} : userDataProps) => {
    const customerData = await prisma.customer.findFirst({
        where:{ auth0_user_id: userId }
    })

    if (!customerData ){
        return nullUser;
    }

    const accountData = await prisma.account.findMany({
        where: {customer_id: customerData?.customer_id},
        select:{
            account_id: true, 
            balance: true, 
            account_type: true, 
        }
    })  
    if (!accountData){
        return nullUser
    }
   
    const activeAccountId = await handleCurrentId();  

    const transactionsRaw = await prisma.transaction.findMany({
        where : {
            OR:[
            { account_id: activeAccountId ?? accountData[0].account_id },
            { account_id2: activeAccountId ?? accountData[0].account_id }
            ]
        }
    })

    // serialize transactions so they contain only plain JS types
    const transactions = transactionsRaw.map((t) => ({
        ...t,
        amount: new Decimal(t.amount),
        created_at: (t as any).created_at ? (t as any).created_at.toISOString() : null,
    }))

    // convert account balances (Decimal) to plain numbers
    const accounts = accountData.map((a) => ({
        account_id: a.account_id,
        balance: (a.balance && typeof (a.balance as any).toNumber === 'function') ? (a.balance as any).toNumber() : Number(a.balance),
        account_type: a.account_type,
    }))

    const user = {
        firstName : customerData.first_name,
        lastName : customerData.last_name,
        accounts : accounts,
        isOnboarded: (customerData?.first_name && customerData?.last_name) ? true : false,
        transactions: transactions
    }
    
    return user;
})


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