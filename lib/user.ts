"use server";
// fetch data about user status and pass it as context
import type { Transaction, Account } from "@prisma/client";
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
    isOnboarded: boolean;
}


const nullUser : userDataReturn = {
    firstName: "", 
    lastName: "", 
    accounts: [],
    isOnboarded: false,
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