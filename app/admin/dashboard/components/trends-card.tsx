"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type TimeMetric = {
  date: string;
  amount: number;
};

export interface TrendsCardProps {
  title: string;
  description?: string;
  trendData: Record<string, TimeMetric[]>;
}

export function TrendsCard({ title, description, trendData }: TrendsCardProps) {
  const [data, setData] = useState(trendData["transactions"])
  const chartConfig = {
    amount: {
      label: "Amount",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex px-20 pb-5 gap-4 ">
            <Button variant={"outline"} onClick={(e) => setData(trendData['balance'])}>Balance</Button>
            <Button variant={"outline"} onClick={(e) => setData(trendData['transactions'])}>Transactions</Button>
          </div>

          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <LineChart
              accessibilityLayer
              data={data ?? []}
              margin={{
                left: 25,
                right: 25,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={true}
                tickMargin={10}
                interval={7}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                domain={["dataMin - 500", "dataMax + 500"]}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="px-5"/>}
              />
              <Line
                dataKey="amount"
                type="linear"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
