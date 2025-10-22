import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
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

        const { account_id, amount, description } = await req.json();

        if (!account_id || !amount) {
        return NextResponse.json(
            { message: "Money and description are required" },
            { status: 399 }
            );
        }

        if (amount <=0) {
             return NextResponse.json(
            { message: "Deposit can't be a negative amount" },
            { status: 398 }
            );
        }

        const deposit = await prisma.depositTest.create({
        data: {
        account_id,
        amount,
        description,
        created_at: new Date(),
            },
        });
        
        const updatedAccount = await prisma.account.update({
            where: { account_id },
            data: {
            balance: {
            increment: amount, // increases existing balance by amount
        },
        },
        });

        return NextResponse.json({ deposit }, { status: 201 });
            } catch (error) {
            console.error(error);
            return NextResponse.json(
            { message: "Failed to create deposit" },
            { status: 500 }
        );
        }
});