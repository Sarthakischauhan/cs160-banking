import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChevronUp, ChevronDown } from "lucide-react";

interface BalanceProps {
  userBalance: number | string | null | undefined;
  monthIncome?: number | string | null;
  monthExpense?: number | string | null;
}

/**
 * This card shows the user their balance and optionally changes in their balance over time.
 * 
 * @param props Include userBalance, optional: monthIncome and monthExpense (both need to be included to provide extra info)
 * @returns A card to show userBalance, and optionally income and expenses
 */
export function BalanceCard(props: BalanceProps) {
  const balance = Number(props.userBalance ?? 0);
  const income = Number(props.monthIncome ?? 0);
  const expense = Number(props.monthExpense ?? 0);
  const diff = income - expense;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Current Balance</CardTitle>
        {props.monthIncome !== undefined && props.monthExpense !== undefined && (
          <CardAction>
            <div className="flex flex-row justify-center items-center">
              <span>
                {diff >= 0 ? <ChevronUp color="green" /> : <ChevronDown color="red" />}
              </span>
              <span>${Math.abs(diff).toFixed(2).toLocaleString()}</span>
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-5xl my-10">
          <span>${balance.toFixed(2).toLocaleString()}</span>
        </div>
        {props.monthIncome !== undefined && props.monthExpense !== undefined && (
          <div className="grid grid-cols-2 gap-10 text-lg">
            <div className="flex flex-col">
              <span>Income</span>
              <span>${income.toFixed(2).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span>Expenses</span>
              <span>${expense.toFixed(2).toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
