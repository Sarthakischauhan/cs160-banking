"use client";

import { useState, useEffect } from "react";
import ReportFilters from "./ReportFilters";
import ReportsCharts from "./ReportsCharts";
import { Card } from "@/components/ui/card";

export default function ReportGenerator() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleGenerate(filters: any) {
        setLoading(true);
        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filters),
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setReportData(data);
            } else {
                console.error(" API returned unexpected data:", data);
                setReportData([]);
            }
        } catch (err) {
            console.error(" Error fetching reports:", err);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        handleGenerate({}); 
    }, []);

    const totalBalance = reportData.reduce(
        (sum, a) => sum + Number(a.balance ?? 0),
        0
    );
    const totalTransactions = reportData.reduce(
        (sum, a) => sum + (a._count?.Transaction ?? 0),
        0
    );
    const avgBalance =
        reportData.length > 0
            ? (totalBalance / reportData.length).toFixed(2)
            : "0.00";

    const chartData = reportData.map((a) => ({
        name: a.account_id.slice(0, 5),
        balance: Number(a.balance),
        transactions: a._count.Transaction,
    }));

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold mb-2">Customer Reports</h1>

            {/* Filters */}
            <ReportFilters onFilter={handleGenerate} />

            {loading ? (
                <Card className="p-6 text-center">Loading report...</Card>
            ) : reportData.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                    No data yet — use filters above to generate a report.
                </Card>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 text-center border">
                            <h3>Total Balance</h3>
                            <p className="text-2xl font-bold ">
                                ${totalBalance.toFixed(2)}
                            </p>
                        </Card>
                        <Card className="p-4 text-center border">
                            <h3>Total Transactions</h3>
                            <p className="text-2xl font-bold">
                                {totalTransactions}
                            </p>
                        </Card>
                        <Card className="p-4 text-center border">
                            <h3>Average Balance</h3>
                            <p className="text-2xl font-bold">
                                ${avgBalance}
                            </p>
                        </Card>
                    </div>

                    <ReportsCharts chartData={chartData} />

                </>
            )}
        </section>
    );
}
