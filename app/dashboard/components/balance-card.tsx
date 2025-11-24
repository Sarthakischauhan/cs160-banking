import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountType } from "@prisma/client";

import { ChevronUp, ChevronDown } from "lucide-react";

interface BalanceProps {
  userBalance: number;
  account_type: AccountType;
  monthIncome?: number;
  monthExpense?: number;
  hidden?: boolean;
}

/**
 * This card handles showing the user their balance and changes in their balance over itme.
 * 
 * @param props Include userBalance, optional: monthIncome and monthExpense (both need to be included to provide extra info)
 * @returns A card to show userBalance, and optionally income and expenses
 */
export function BalanceCard(props: BalanceProps) {
  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle><h1>Current Balance</h1></CardTitle>

          {props.monthIncome !== undefined &&
           props.monthExpense !== undefined && (
            <CardAction>
              <div className="flex flex-row justify-center items-center">
                <span>
                  {props.monthIncome - props.monthExpense >= 0 ? (
                    <ChevronUp color="green" />
                  ) : (
                    <ChevronDown color="red" />
                  )}
                </span>
                <span>
                  $
                  {Math.abs(props.monthIncome - props.monthExpense)
                    .toFixed(2)
                    .toLocaleString()}
                </span>
              </div>
            </CardAction>
          )}
        </CardHeader>

        <CardContent>
          <div className="text-5xl my-10 h-14 flex items-center">
            <span
              className={`transition-all duration-500 ${
                props.hidden
                  ? "blur-sm opacity-60 select-none"
                  : "opacity-100 blur-0"
              }`}
            >
              {props.hidden
                ? "••••••••"
                : `$${props.userBalance.toFixed(2).toLocaleString()}`}
            </span>
          </div>

          {props.monthIncome !== undefined &&
           props.monthExpense !== undefined && (
            <div className="grid grid-cols-2 gap-10 text-lg">
              <div className="flex flex-col">
                <span>Income</span>
                <span>${props.monthIncome.toFixed(2).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span>Expenses</span>
                <span>${props.monthExpense.toFixed(2).toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}