"use server";
// fetch data about user status and pass it as context
import type { Transaction, Account } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { cache } from "react"

type getAccountProps = {
    account_id: string
}

export const getAccount = async ({account_id}:getAccountProps) => {
    if (!account_id){
        return null
    }

    const accountData = await prisma.account.findFirst({
        where: {account_id: account_id},
        select:{
            account_type: true, 
            balance: true, 
        }
    })

    if (!accountData){
        return null;
    }

    return accountData;
}