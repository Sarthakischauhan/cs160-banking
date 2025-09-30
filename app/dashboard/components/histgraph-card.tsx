"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const balanceHistory = [
  { week: "2025-08-18", balance: 1025.0 },
  { week: "2025-08-25", balance: 875.2 },
  { week: "2025-09-01", balance: 975.5 },
  { week: "2025-09-08", balance: 1450.75 },
  { week: "2025-09-15", balance: 850.25 },
  { week: "2025-09-22", balance: 940.61 },
  { week: "2025-09-29", balance: 1244.25 },
];

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function HistgraphCard() {
  return (
    <Card className="h-90">
      <CardHeader>
        <CardTitle>Balance History</CardTitle>
        <CardDescription>Weekly Balance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-65 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={balanceHistory}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              dataKey="balance"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => "$" + value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="balance" fill="blue" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
