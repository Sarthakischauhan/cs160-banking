// Create users transaction
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth0, getRole } from "@/lib/auth0";

// Get current user's customer profile. Admins can list all with ?all=true
export const GET = auth0.withApiAuthRequired(async (req: NextRequest) => {
    try {
        const session = await auth0.getSession();
        if (!session) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

        const role = getRole(session as any);
        const isAdmin = role?.includes("Admin");
        const { searchParams } = new URL(req.url);
        const wantAll = searchParams.get("all") === "true";

        if (isAdmin && wantAll) {
            const customers = await prisma.customer.findMany();
            return NextResponse.json(customers, { status: 200 });
        }

        const auth0UserId = session.user?.sub || "";
        if (!auth0UserId) return NextResponse.json({ message: "User not found in session" }, { status: 400 });

       const existing = await prisma.customer.findUnique({ where: { auth0_user_id: auth0UserId } });
        
       const customerData = {
        first_name: existing?.first_name ?? null,
        last_name: existing?.last_name ?? null,
        address: existing?.address ?? null,
        phone: existing?.phone ?? null,
        account_type: existing?.account_type ?? null,
        email: existing?.email ?? null,
    };

        return NextResponse.json(customerData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
    }
});

// Create or update current user's profile (self-service)
export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
    console.log
    try {
        const session = await auth0.getSession();
        if (!session) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

        const auth0UserId = session.user?.sub || "";
        if (!auth0UserId) return NextResponse.json({ message: "User not found in session" }, { status: 400 });

        const body = await req.json();
        const { first_name, last_name, address, phone, account_type, email } = body || {};

        const fullName = session.user.name || ""; // fallback if null
        const [first, ...rest] = fullName.split(" "); // split by spaces
        const last = rest.join(" "); 

        const existing = await prisma.customer.findUnique({ where: { auth0_user_id: auth0UserId } });
        if (existing) {
            const updated = await prisma.customer.update({
        where: { auth0_user_id: auth0UserId },
            data: {
            first_name: existing.first_name ?? first,
            last_name: existing.last_name ?? last,
            address: existing.address ?? session.user.address,
            phone: existing.phone ?? session.user.phone_number,
            account_type: existing.account_type ?? session.user.account_type,
            email: existing.email ?? session.user.email,
            },
        });
        
            return NextResponse.json(updated, { status: 200 });
        }

        const created = await prisma.customer.create({
            data: {
                auth0_user_id: auth0UserId,
                first_name: first_name ?? session.user.name,
                last_name: last_name ?? null,
                address: address ?? null,
                phone: phone ?? null,
                account_type: account_type ?? null,
                email: email ?? session.user.email,
            },
        });
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to upsert profile" }, { status: 500 });
    }
});
