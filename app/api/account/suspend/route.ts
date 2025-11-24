import { auth0, getRole } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { AccountStatus } from "@prisma/client";

export const PUT = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const role = getRole(session as any);
    const isAdmin = role?.includes("Admin");

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Error: Non-admin user attempting admin action" },
        { status: 403 }
      );
    }

    const { account_id } = await req.json();

    // validate input
    if (!account_id || typeof account_id !== "string") {
      return NextResponse.json(
        { message: "Invalid account_id" },
        { status: 400 }
      );
    }

    const account = await prisma.account.findUnique({
      where: { account_id }
    });

    if (!account) {
      return NextResponse.json(
        { message: "Error: Account does not exist" },
        { status: 404 }
      );
    }

    // Use enum type from Prisma
    await prisma.account.update({
      where: { account_id },
      data: {
        account_status: AccountStatus.CLOSED
      }
    });

    return NextResponse.json(
      { message: "Successfully Suspended Account" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
});
