import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0 } from "@/lib/auth0";
import { TransactionType } from "@prisma/client";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findFirst({
      where: { auth0_user_id: session.user.sub },
      select: { customer_id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Bad request: customer not found" },
        { status: 400 }
      );
    }

    const accounts = await prisma.account.findMany({
      where: { customer_id: customer.customer_id },
    });

    if (accounts.length === 0) {
      return NextResponse.json(
        { message: "Bad request: no accounts found" },
        { status: 400 }
      );
    }

    const { account_id, amount, description } = await req.json();

    if (!account_id || !amount || !description) {
      return NextResponse.json(
        { message: "Bad request: missing fields" },
        { status: 400 }
      );
    }

    // validating user account
    const account = accounts.find(
      (acc) => acc.account_id === account_id
    );

    if (!account) {
      return NextResponse.json(
        { message: "Invalid user account" },
        { status: 400 }
      );
    }

    if (account.account_status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Account no longer active" },
        { status: 403 }
      );
    }

    // MAIN TRANSACTION BLOCK
    const result = await prisma.$transaction(async (tx) => {
      // transaction ledger entry
      const txn = await tx.transaction.create({
        data: {
          account_id: account.account_id,
          account_id2: account.account_id,
          description: description,
          transaction_status: "PENDING",
          transaction_type: "WITHDRAWAL",
          amount: amount,
        },
      });

      return txn;
    });

    return NextResponse.json(
      {
        message: "Withdrawal successful",
        transaction: result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Deposit API Error:", err);
    // TODO -> make sure to create new transaction for failed stuff
    return NextResponse.json(
      { message: "Internal Server Error", error: err?.message },
      { status: 500 }
    );
  }
});
