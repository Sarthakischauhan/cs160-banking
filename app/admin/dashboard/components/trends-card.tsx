"use client";

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
  data: TimeMetric[];
}

export function TrendsCard({
  title,
  description,
  data,
}: TrendsCardProps) {
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
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={data ?? []}
                margin={{
                  left: 12,
                  right: 12,
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="amount"
                  type="linear"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
