// /app/api/assistant/route.ts

import { TransactionType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/prisma/prisma";

/* ---------- Helpers ---------- */

function toNumberSafe(value: any): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  if (typeof value === "object" && "toNumber" in value)
    return (value as any).toNumber();
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// Extract goal_amount from text. Returns null if none found.
function extractGoalFromMessage(msg: string): number | null {
  if (!msg) return null;

  // Examples it detects:
  // “save 5000”, “goal is 12,000”, “$8000”, “8k”, “want to save 5k”
  const regex = /(\$?\s*\d+(?:,\d{3})*(?:\.\d+)?)(k)?/i;
  const match = msg.toLowerCase().match(regex);

  if (!match) return null;

  const num = match[1].replace(/[,$]/g, "");
  let value = Number(num);
  if (!isFinite(value)) return null;

  if (match[2] === "k") value *= 1000; // handle “5k”, “12k”, etc.

  return value > 0 ? value : null;
}

function computeProjections(data: {
  monthly_income?: number | null;
  monthly_expenses?: number | null;
  current_savings?: number | null;
  goal_amount?: number | null;
}) {
  const { monthly_income, monthly_expenses, current_savings, goal_amount } =
    data;

  const missing: string[] = [];
  if (monthly_income == null) missing.push("monthly_income");
  if (monthly_expenses == null) missing.push("monthly_expenses");
  if (current_savings == null) missing.push("current_savings");
  if (goal_amount == null) missing.push("goal_amount");

  if (missing.length > 0) {
    return { error: "missing_data", missingFields: missing };
  }

  const monthlySavings = monthly_income! - monthly_expenses!;
  const remaining = Math.max(0, goal_amount! - (current_savings ?? 0));
  const monthsToGoal =
    monthlySavings > 0 ? remaining / monthlySavings : Infinity;

  const expenses10cut = monthly_expenses! * 0.9;
  const monthlySavingsWithCut = monthly_income! - expenses10cut;
  const monthsWithCut =
    monthlySavingsWithCut > 0 ? remaining / monthlySavingsWithCut : Infinity;

  function round1(x: number) {
    if (!isFinite(x)) return x;
    return Math.round(x * 10) / 10;
  }

  return {
    error: null,
    monthly_savings: round1(monthlySavings),
    remaining: round1(remaining),
    months_to_goal: monthsToGoal === Infinity ? Infinity : round1(monthsToGoal),
    months_to_goal_with_10pct_cut:
      monthsWithCut === Infinity ? Infinity : round1(monthsWithCut),
  };
}

console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function callAIAgent({
  systemPrompt,
  messages,
}: {
  systemPrompt: string;
  messages: any[];
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content ?? "No response.";
}

/* ---------- Route ---------- */

export const POST = auth0.withApiAuthRequired(async (req: NextRequest) => {
  try {
    const session = await auth0.getSession();
    if (!session)
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const userMessage: string = String(body.userMessage ?? "").trim();

    const extractedGoal = extractGoalFromMessage(userMessage);

    const auth0UserId = session.user?.sub || "";
    const customer = await prisma.customer.findUnique({
      where: { auth0_user_id: auth0UserId },
      select: {
        customer_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        monthly_income: true,
      },
    });

    if (!customer)
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );

    const accounts = await prisma.account.findMany({
      where: { customer_id: customer.customer_id },
      select: { account_id: true, account_type: true, balance: true },
    });

    const accountIds = accounts.map((a) => a.account_id);
    const currentSavings = accounts.reduce(
      (sum, acc) => sum + (toNumberSafe(acc.balance) ?? 0),
      0,
    );

    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);

    const transactions =
      accountIds.length === 0
        ? []
        : await prisma.transaction.findMany({
            where: {
              account_id: { in: accountIds },
              transaction_status: { in: ["COMPLETED", "PENDING"] },
            },
            select: {
              transaction_id: true,
              amount: true,
              created_at: true,
              transaction_type: true,
            },
            orderBy: { created_at: "desc" },
          });

    const tx = transactions.map((t) => ({
      ...t,
      amount: toNumberSafe(t.amount) ?? 0,
    }));
    const recentTx = tx.filter((t) => new Date(t.created_at) >= ninetyDaysAgo);

    const depositSum = recentTx
      .filter((t) => t.transaction_type === TransactionType.DEPOSIT)
      .reduce((s, t) => s + t.amount, 0);

    const expenseSum = recentTx
      .filter(
        (t) =>
          t.transaction_type === TransactionType.WITHDRAWAL ||
          t.transaction_type === TransactionType.TRANSFER,
      )
      .reduce((s, t) => s + t.amount, 0);

    const derivedMonthlyIncome = depositSum / 3;
    const derivedMonthlyExpenses = expenseSum / 3;

    const storedMonthlyIncome = toNumberSafe(customer.monthly_income);
    const monthly_income =
      storedMonthlyIncome ??
      (derivedMonthlyIncome > 0 ? derivedMonthlyIncome : null);
    const monthly_expenses =
      derivedMonthlyExpenses > 0 ? derivedMonthlyExpenses : null;

    const projectionResult = computeProjections({
      monthly_income,
      monthly_expenses,
      current_savings: currentSavings,
      goal_amount: extractedGoal,
    });

    const missingFields: string[] =
      projectionResult.error === "missing_data"
        ? ((projectionResult as any).missingFields ?? [])
        : [];

    const systemPrompt = `You are a conservative financial assistant embedded in a banking website.
Use ONLY the numeric values provided. Do not invent transactions, account balances, or income.`;

    const userContext = [
      `User message: ${userMessage || "(none)"}`,
      `Extracted goal: ${extractedGoal ?? "null"}`,
      `Financial summary:`,
      `- monthly_income: ${monthly_income ?? "null"}`,
      `- monthly_expenses: ${monthly_expenses ?? "null"}`,
      `- current_savings: ${currentSavings}`,
    ].join("\n");

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userContext}\n\nMissing fields: ${missingFields.join(", ") || "none"}`,
      },
    ];

    if (
      !missingFields.length &&
      projectionResult &&
      !(projectionResult as any).error
    ) {
      messages.push({
        role: "user",
        content:
          "Projection:\n" +
          `monthly_savings: ${(projectionResult as any).monthly_savings}\n` +
          `remaining: ${(projectionResult as any).remaining}\n` +
          `months_to_goal: ${(projectionResult as any).months_to_goal}\n` +
          `months_to_goal_with_10pct_cut: ${(projectionResult as any).months_to_goal_with_10pct_cut}`,
      });
    }

    const aiReply = await callAIAgent({ systemPrompt, messages });

    return NextResponse.json(
      {
        assistant: aiReply,
        projection: projectionResult,
        missingFields,
        derived: {
          derivedMonthlyIncome: Math.round(derivedMonthlyIncome * 100) / 100,
          derivedMonthlyExpenses:
            Math.round(derivedMonthlyExpenses * 100) / 100,
          current_savings: Math.round(currentSavings * 100) / 100,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("assistant route error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
});
