import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";
import { Decimal } from "@prisma/client/runtime/library";
import { formatCurrency } from "@/lib/utils";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const role = getRole(session);
    if (!role.includes("Admin")) {
      return NextResponse.json(
        { message: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    const { transaction_id, updateType } = await req.json();

    if (!transaction_id) {
      return NextResponse.json(
        { message: "transaction_id required" },
        { status: 400 }
      );
    }

    if (!updateType) {
      return NextResponse.json(
        { message: "updateType required" },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: { transaction_id: transaction_id },
      include: {
        Account: {
          include: {
            Customer: true,
          },
        },
        Account_Transaction_account_id2ToAccount: {
          include: {
            Customer: true,
          },
        },
      },
    });

    if (!tx || !tx.Account) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    let message1 = "";
    let message2 = "";

    if (updateType === "APPROVE") {
      switch (tx.transaction_type) {
        case "DEPOSIT":
          message1 = `ADMINISTRATOR APPROVAL: Successfully deposited ${formatCurrency(
            tx.amount.toNumber()
          )} into ${tx.Account.account_type} account`;
          break;
        case "WITHDRAWAL":
          message1 = `ADMINISTRATOR APPROVAL: Successfully withdrew ${formatCurrency(
            tx.amount.toNumber()
          )} from ${tx.Account.account_type} account`;
          break;
        case "TRANSFER":
          message1 = `ADMINISTRATOR APPROVAL: Successfully sent ${formatCurrency(
            tx.amount.toNumber()
          )} to ${
            tx.Account_Transaction_account_id2ToAccount?.Customer.first_name
          } ${tx.Account_Transaction_account_id2ToAccount?.Customer.last_name}`;
          message2 = `ADMINISTRATOR APPROVAL: Received ${formatCurrency(
            tx.amount.toNumber()
          )} from ${tx.Account.Customer.first_name} ${
            tx.Account.Customer.last_name
          }`;
          break;
      }
    } else if (updateType === "CANCEL") {
      switch (tx.transaction_type) {
        case "DEPOSIT":
          message1 = `ADMINISTRATOR CANCELED: Cancelled deposit ${formatCurrency(
            tx.amount.toNumber()
          )} into ${tx.Account.account_type} account`;
          break;
        case "WITHDRAWAL":
          message1 = `ADMINISTRATOR CANCELED: Cancelled withdrawal ${formatCurrency(
            tx.amount.toNumber()
          )} from ${tx.Account.account_type} account`;
          break;
        case "TRANSFER":
          message1 = `ADMINISTRATOR CANCELED: Cancelled ${formatCurrency(
            tx.amount.toNumber()
          )} to ${
            tx.Account_Transaction_account_id2ToAccount?.Customer.first_name
          } ${tx.Account_Transaction_account_id2ToAccount?.Customer.last_name}`;
          message2 = `ADMINISTRATOR CANCELED: Cancelled ${formatCurrency(
            tx.amount.toNumber()
          )} from ${tx.Account.Customer.first_name} ${
            tx.Account.Customer.last_name
          }`;
          break;
      }
    }

    await prisma.notifications.create({
      data: {
        notification_type: updateType,
        message: message1,
        delivery_method: "EMAIL",
        customer: tx.Account.Customer.customer_id,
      },
    });

    if (
      tx.transaction_type === "TRANSFER" &&
      tx.account_id2 &&
      tx.account_id !== tx.account_id2 && 
      tx.Account_Transaction_account_id2ToAccount?.Customer
    ) {
      await prisma.notifications.create({
        data: {
          notification_type: updateType,
          message: message2,
          delivery_method: "EMAIL",
          customer:
            tx.Account_Transaction_account_id2ToAccount.Customer.customer_id,
        },
      });
    }

    return NextResponse.json(
      { message: "Notification completed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return NextResponse.json(
      { message: "Failed to approve transaction", error: error?.message },
      { status: 500 }
    );
  }
});
