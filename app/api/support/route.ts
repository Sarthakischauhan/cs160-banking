import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";
import { Decimal } from "@prisma/client/runtime/library";
import { formatCurrency } from "@/lib/utils";
import { TicketType } from "@prisma/client";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const auth0UserId = session.user?.sub || "";
    const customer = await prisma.customer.findUnique({
      where: { auth0_user_id: auth0UserId },
    });
    if (!customer)
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 400 }
    );

    let { subject, message, account_id, transaction_id, ticketType, tags }: {subject?: string, message: string, account_id?: string, transaction_id?: string, ticketType: string, tags?: string[]} = await req.json();

    if (!message || message.length === 0) {
        throw new Error("SupTix message should not be empty")
    }

    if (!ticketType || ticketType.length === 0) {
        throw new Error("Ticket Type on support ticket should not be empty")
    }
    
    let messageFinal = message

    if (transaction_id) {
        const exists = await checkCancelTransaction(transaction_id)
        if (exists) {
            throw new Error("This transaction is already under review for cancellation")
        }
        const tx = await prisma.transaction.findUnique({
            where: {
                transaction_id: transaction_id
            }
        })
        if (!tx) {
            throw new Error("Transaction doesn't exist")
        }
        account_id = tx.account_id
        messageFinal = `${messageFinal}\nTransaction Amount: ${formatCurrency(tx.amount.toNumber())}`
    }

    await prisma.supportTicket.create({
        data: {
            customer_id: customer.customer_id,
            transaction_id: transaction_id ?? null,
            account_id: account_id ?? null,
            subject: subject ?? null,
            message: messageFinal,
            ticket_type: ticketType as TicketType,
            tags: tags
        }
    })

    return NextResponse.json(
      { message: "Support Ticket Created" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return NextResponse.json(
      { message: error?.message, error: error?.message },
      { status: 500 }
    );
  }
});


    
async function checkCancelTransaction(id: string) {
  const tx = await prisma.supportTicket.findFirst({
    where: {
      transaction_id: id,
      ticket_type: "CANCEL",
    },
    select: { transaction_id: true }, // just need one field to minimize query
  });
  return !!tx; // true if exists, false otherwise
}