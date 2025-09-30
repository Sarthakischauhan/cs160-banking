import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChevronUp, ChevronDown } from "lucide-react";

interface BalanceProps {
  userBalance: number;
  monthIncome: number;
  monthExpense: number;
}

export function BalanceCard(props: BalanceProps) {
  return (
    <>
      <Card className="h-70">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardAction>
            <div className="flex flex-row justify-center items-center">
              <span className="">
                {props.monthIncome - props.monthExpense >= 0 ? (
                  <ChevronUp color="green" />
                ) : (
                  <ChevronDown color="red" />
                )}
              </span>
              <span>${Math.abs(props.monthIncome - props.monthExpense).toFixed(2).toLocaleString()}</span>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-5xl my-10">
            <span>${props.userBalance.toFixed(2).toLocaleString()}</span>
          </div>
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
        </CardContent>
      </Card>
    </>
  );
}
