import { auth0, getRole } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { TicketStatus } from "@prisma/client";

export const PUT = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    const roles = getRole(session).split(",").map(r => r.trim());

    if (!roles.includes("Admin")) {
      return NextResponse.json(
        { message: "Error: Non-admin user attempting admin action" },
        { status: 403 }
      );
    }

    const { sticket_id, newStatus } = await req.json()
    console.log(sticket_id)

    if (!(newStatus in TicketStatus)) {
      return NextResponse.json(
        { message: "Invalid ticket status" },
        { status: 400 }
      );
    }

    if (!sticket_id) {
      return NextResponse.json(
        { message: "Missing ticket ID" },
        { status: 400 }
      );
    }

    const existingTicket = await prisma.supportTicket.findUnique({
      where: { sticket_id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    if (existingTicket.ticket_status === newStatus) {
      return NextResponse.json(
        { message: "Ticket already in this status" },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.update({
      where: {
        sticket_id: sticket_id,
      },
      data: {
        ticket_status: newStatus,
      },
    });

    return NextResponse.json(
      { message: "Ticket status updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Update Ticket Status Error: ", error);
    return NextResponse.json(
      {
        message: error.message ? error.message : "Error updating ticket status",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
});
