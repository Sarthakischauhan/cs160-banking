import { SupportTicket, TicketStatus, TicketType } from "@prisma/client";

import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function getSupportTickets(
  params?: {
    firstName?: string;
    lastName?: string;
    minDate?: string;
    maxDate?: string;
    ticketStatus?: string | string[];
    ticketType?: string | string[];
  },
  cursor?: string,
  pageSize: number = 20
) {
  try {
    const { firstName, lastName, minDate, maxDate, ticketStatus, ticketType } =
      params ?? {};

    const limit = pageSize;
    const where: any = {};

    if (minDate || maxDate) {
      where.created_at = {};
      if (minDate) where.created_at.gte = new Date(minDate);
      if (maxDate) where.created_at.lte = new Date(maxDate);
    }

    if (firstName) {
      where.OR = [
        {
          Customer: {
            first_name: {
              contains: firstName,
              mode: "insensitive",
            },
          },
        },
        {
          Handler: {
            first_name: {
              contains: firstName,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (lastName) {
      where.OR = [
        {
          Customer: {
            last_name: { contains: lastName, mode: "insensitive" },
          },
        },
        {
          Handler: {
            last_name: { contains: lastName, mode: "insensitive" },
          },
        },
      ];
    }

    if (ticketStatus) {
      where.ticket_status = Array.isArray(ticketStatus)
        ? { in: ticketStatus as TicketStatus[] }
        : (ticketStatus as TicketStatus);
    }

    if (ticketType) {
      where.ticket_type = ticketType as TicketType;
    }

    const data = await prisma.supportTicket.findMany({
      where,
      include: {
        Customer: true,
        Handler: true,
      },
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { sticket_id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0, // skip the cursor itself
    });

    return data;
  } catch (error: any) {
    throw new Error(
      error.message ? error.message : "Error retrieving support tickets"
    );
  }
}
