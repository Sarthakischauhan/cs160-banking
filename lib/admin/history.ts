import { DepositTest, Transaction } from "@prisma/client";

export function calculateTransactionHistory(
  transactions: Transaction[],
  start: Date,
  end: Date
) {
  // Pre-fill the map with all dates in the range
  const dateMap = new Map<string, number>();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    dateMap.set(dateStr, 0);
  }

  // Sum transaction amounts
  for (const t of transactions) {
    const dateStr = t.created_at.toISOString().split("T")[0];
    if (dateMap.has(dateStr)) {
      dateMap.set(dateStr, dateMap.get(dateStr)! + Number(t.amount));
    }
  }

  // Convert map to sorted array
  const arr: { date: string; amount: number }[] = [];
  for (const [date, amount] of dateMap) {
    arr.push({ date, amount });
  }

  return arr;
}

export function calculateBalanceHistory(
  deposits: DepositTest[],
  currentBalance: number,
  timeFrame: number
) {
  // 1. Aggregate amounts per day
  const dailyTotals = new Map<string, number>();
  for (const t of deposits) {
    const date = t.created_at.toISOString().split("T")[0]; // YYYY-MM-DD
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + Number(t.amount));
  }

  // 2. Generate all dates in the timeframe
  const history: { date: string; amount: number }[] = [];
  let amount = currentBalance;

  const end = new Date(); // today
  const start = new Date();
  start.setDate(end.getDate() - timeFrame + 1); // include today as last day

  for (let d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
    const dateStr = d.toISOString().split("T")[0];
    history.push({ date: dateStr, amount });
    amount -= dailyTotals.get(dateStr) || 0; // subtract if there was a transaction
  }

  return history.reverse(); // oldest date first
}