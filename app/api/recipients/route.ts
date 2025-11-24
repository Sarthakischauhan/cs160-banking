import { type NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/prisma/prisma";

export const GET = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q")?.trim();
    const excludeAccountId = searchParams.get("exclude");

    if (!search || search.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    const accounts = await prisma.account.findMany({
      where: {
        account_id: excludeAccountId ? { not: excludeAccountId } : undefined,
        Customer: {
          OR: [
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      select: {
        account_id: true,
        account_type: true,
        Customer: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      take: 8,
    });

    const payload = accounts.map((account) => {
      const customer = account.Customer;
      const nameParts = [
        customer?.first_name ?? "",
        customer?.last_name ?? "",
      ].filter(Boolean);

      return {
        account_id: account.account_id,
        account_type: account.account_type,
        name: nameParts.length
          ? nameParts.join(" ")
          : (customer?.email ?? "Unknown User"),
        email: customer?.email ?? null,
      };
    });

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Failed to search recipients", error);
    return NextResponse.json(
      { message: "Failed to search recipients" },
      { status: 500 },
    );
  }
});
