// fetch data about user status and pass it as context
import type { Customer, Account } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { cache } from "react"

type userDataProps = {
    userId: string;
}

export const getUserData = cache(async ({userId} : userDataProps) => {

    const customerData = await prisma.customer.findFirst({
        where:{ auth0_user_id: userId }
    })  
    if (!customerData){
        return {}
    }
    const accountData = await prisma.account.findMany({
        where: {customer_id: customerData?.customer_id}
    })  
    if (!accountData){
        return {}
    }
    const user = {
        firstName : customerData.first_name,
        lastName : customerData.last_name,
        accounts : accountData, 
        isOnboarded: (customerData?.first_name && customerData?.last_name) ? true : false
    } 
    
    return user;
})