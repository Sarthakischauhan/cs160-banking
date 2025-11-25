import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        const role = getRole(session as any);
        const isAdmin = role?.includes("Admin");

        if (!isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const {
            customerId,
            accountType,
            minBalance,
            maxBalance,
            startDate,
            endDate,
        } = await req.json();

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
            include: {
                Customer: {
                    select: {
                        customer_id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
                Transaction_Transaction_account_id2ToAccount: {
                    select: {
                        transaction_id: true,
                        amount: true,
                        transaction_type: true,
                        transaction_status: true,
                        created_at: true,
                    },
                },
            },
        });

        const formatted = accounts.map((acc) => ({
            ...acc,
            balance: Number(acc.balance ?? 0),
            customer_full_name: `${acc.Customer?.first_name ?? ""} ${acc.Customer?.last_name ?? ""}`.trim(),
            transactions: acc.Transaction_Transaction_account_id2ToAccount ?? [],
        }));

        return NextResponse.json(formatted, { status: 200 });
    } catch (err) {
        console.error("Error generating report:", err);
        return NextResponse.json(
            { message: "Error generating report" },
            { status: 500 }
        );
    }
});

export async function GET(req: NextRequest) {
    try {
        const customerId =
            req.nextUrl.searchParams.get("customerId") ||
            req.nextUrl.searchParams.get("customer_id");

        if (!customerId) {
            return NextResponse.json({ message: "Missing customerId" }, { status: 400 });
        }

        const customer = await prisma.customer.findUnique({
            where: { customer_id: customerId },
            include: {
                Account: {
                    include: {
                        Transaction_Transaction_account_id2ToAccount: true,
                    },
                },
            },
        });

        if (!customer) {
            return NextResponse.json({ message: "Customer not found" }, { status: 404 });
        }

        const transactions = customer.Account.flatMap(
            (a) => a.Transaction_Transaction_account_id2ToAccount
        );

        return NextResponse.json({
            customer,
            accounts: customer.Account,
            transactions,
        });
    } catch (err) {
        console.error("Error fetching admin report:", err);
        return NextResponse.json(
            { message: "Error fetching admin report" },
            { status: 500 }
        );
    }
}
