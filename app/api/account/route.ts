import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

// List accounts. Admins see all. Non-admins see their own accounts.
export const GET = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }

        const role = getRole(session as any);
        const isAdmin = role?.includes("Admin");

        if (isAdmin) {
            const accounts = await prisma.account.findMany();
            return NextResponse.json(accounts, { status: 200 });
        }

        const auth0UserId = session.user?.sub || "";
        console.log(auth0UserId)
        if (!auth0UserId) {
            return NextResponse.json({ message: "User not found in session" }, { status: 400 });
        }

        const customer = await prisma.customer.findUnique({ where: { auth0_user_id: auth0UserId } });
        if (!customer) {
            return NextResponse.json([], { status: 200 });
        }

        const accounts = await prisma.account.findMany({ where: { customer_id: customer.customer_id } });
        return NextResponse.json(accounts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch accounts" }, { status: 500 });
    }
});

// Create an account for a given customer_id. Admin only.
export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        const role = getRole(session as any);
        const isAdmin = role?.includes("Admin");
        if (!isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { customer_id, initial_balance } = await req.json();
        if (!customer_id) {
            return NextResponse.json({ message: "customer_id is required" }, { status: 400 });
        }

        const account = await prisma.account.create({
            data: {
                customer_id,
                // prisma Decimal expects string/number; default 0.00 if not provided
                balance: initial_balance ?? undefined,
            },
        });
        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create account" }, { status: 500 });
    }
});

// Delete an account by account_id. Admin only.
export const DELETE = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        const role = getRole(session as any);
        const isAdmin = role?.includes("Admin");
        if (!isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const account_id = searchParams.get("account_id");
        if (!account_id) {
            return NextResponse.json({ message: "account_id is required" }, { status: 400 });
        }

        await prisma.account.delete({ where: { account_id } });
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete account" }, { status: 500 });
    }
});