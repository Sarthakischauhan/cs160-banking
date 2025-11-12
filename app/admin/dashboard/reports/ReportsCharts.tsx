"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from "recharts";
import { Card } from "@/components/ui/card";

type ChartProps = {
    chartData: {
        name: string;
        balance: number;
        transactions: number;
    }[];
};

export default function ReportsCharts({ chartData }: ChartProps) {
    return (
        <>
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Balance per Account</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#2CB819"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                    Transactions per Account
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="transactions" fill="#8341DF" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </>
    );
}
