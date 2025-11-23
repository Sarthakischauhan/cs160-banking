import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        const role = getRole(session as any);
        // const isAdmin = role?.includes("Admin");

        // if (!isAdmin) {
        //     return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        // }

        const { customerId, accountType, minBalance, maxBalance, startDate, endDate } =
            await req.json();

        const where: any = {};

        if (customerId) where.customer_id = customerId;
        if (accountType) where.account_type = accountType;
        if (minBalance || maxBalance)
            where.balance = {
                ...(minBalance ? { gte: minBalance } : {}),
                ...(maxBalance ? { lte: maxBalance } : {}),
            };

        if (startDate || endDate)
            where.created_at = {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
            };

        const accounts = await prisma.account.findMany({
            where,
            include: { Customer: true, _count: { select: { Transaction_Transaction_account_id2ToAccount: true } } },
        });
        const formatted = accounts.map((acc) => ({
            ...acc,
            balance: Number(acc.balance ?? 0),
        }));

        return NextResponse.json(accounts, { status: 200 });
    } catch (err) {
        console.error("Error generating report:", err);
        return NextResponse.json(
            { message: "Error generating report" },
            { status: 500 }
        );
    }
});
