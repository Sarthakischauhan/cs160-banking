import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0 } from "@/lib/auth0";
import { TransactionType } from "@prisma/client";

// app/api/report/route.ts
export const GET = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
      const session = await auth0.getSession();
      if (!session) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  
      const auth0UserId = session.user?.sub || "";
      const customer = await prisma.customer.findUnique({
        where: { auth0_user_id: auth0UserId },
        select: {
          customer_id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          address: true,
        },
      });
  
      if (!customer)
        return NextResponse.json({ message: "Customer not found" }, { status: 404 });
  
      const accounts = await prisma.account.findMany({
        where: { customer_id: customer.customer_id },
        select: {
          account_id: true,
          account_type: true,
          balance: true,
        },
      });
  
      const accountIds = accounts.map((acc) => acc.account_id);
  
      const transactions =
        accountIds.length === 0
          ? []
          : await prisma.transaction.findMany({
              where: {
                account_id: { in: accountIds },
                transaction_type: { in: [TransactionType.WITHDRAWAL, TransactionType.TRANSFER] },
                transaction_status: { in: ["COMPLETED", "PENDING"] },
              },
              select: {
                transaction_id: true,
                amount: true,
                created_at: true,
                transaction_type: true,
                description: true,
              },
              orderBy: { created_at: "desc" },
            });
  
      const transactionsWithNumbers = transactions.map((t) => ({
        ...t,
        amount:
          typeof t.amount === "object" && "toNumber" in t.amount
            ? (t.amount as any).toNumber()
            : Number(t.amount),
      }));
  
      return NextResponse.json(
        {
          customer,
          accounts: accounts.map((acc) => ({
            ...acc,
            balance:
              typeof acc.balance === "object" && "toNumber" in acc.balance
                ? (acc.balance as any).toNumber()
                : Number(acc.balance),
          })),
          transactions: transactionsWithNumbers,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching report data:", error);
      return NextResponse.json({ message: "Failed to fetch report data" }, { status: 500 });
    }
  });
  