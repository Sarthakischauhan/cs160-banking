import { prisma, supabase } from "@/prisma/prisma1";
import { NextResponse } from "next/server";

// POST /api/createAccount
export async function POST(request) {
  try {
    const { customer_id } = await request.json();
    if (!customer_id) {
      return NextResponse.json({ error: "Missing customer_id" }, { status: 400 });
    }

    // Check if account exists
    const { data: existingAccount, error: accountError } = await supabase
      .from("Account")
      .select("*")
      .eq("customer_id", customer_id)
      .single();

    if (accountError && accountError.code !== "PGRST116") {
      console.error("Error fetching account:", accountError);
      return NextResponse.json({ error: accountError.message }, { status: 500 });
    }

    // Return existing account
    if (existingAccount) {
      return NextResponse.json({ account: existingAccount });
    }

    // Otherwise, create new one
    const { data: newAccount, error: createError } = await supabase
      .from("Account")
      .insert({
        customer_id,
        balance: 0,
        created_at: new Date(),
        updated_at: new Date(),
        account_type: "CHECKING",
        account_status: "ACTIVE",
      })
      .select();

    if (createError) {
      console.error("Error creating account:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    const newAccountPrisma = await prisma.account.findUnique({
      where: { account_id: newAccount[0].account_id },
    });

    return NextResponse.json({
      account: { ...newAccountPrisma, balance: newAccountPrisma?.balance ?? 0 },
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
