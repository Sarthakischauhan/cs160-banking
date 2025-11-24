"use client";

import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { ReportCard } from "@/app/dashboard/components/report-card";
import { Button } from "@/components/ui/button";

export default function BankManagerDashboard() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("balance");
  const [loading, setLoading] = useState(true);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      if (Array.isArray(data)) setReportData(data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }
  async function generateReport() {
    try {
      const response = await fetch("/api/report");
      if (!response.ok) throw new Error("Failed to fetch report data");

      const data = await response.json();
      const { customer, transactions } = data;

      // make a simple PDF
      const doc = new jsPDF();
      doc.text(`Customer ID: ${customer.customer_id}`, 10, 10);
      doc.text(`Transactions: ${transactions.length}`, 10, 20);
      doc.save(`report-${customer.customer_id}.pdf`);
    } catch (err) {
      console.error("Error generating report:", err);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Summary metrics
  const totalAccounts = reportData.length;
  const totalBalance = reportData.reduce(
    (sum, a) => sum + Number(a.balance ?? 0),
    0,
  );

  const totalTransactions = reportData.reduce(
    (sum, acc) => sum + (acc._count?.Transaction || 0),
    0,
  );

  const filteredData = (reportData ?? [])
    // Filter by account type
    .filter((acc) => {
      const type = acc.account_type?.toLowerCase() ?? "";
      return filter === "all" || type === filter.toLowerCase();
    });

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "savings":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading account data...
      </div>
    );
  }

  if (!reportData || reportData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Data Available
            </h3>
            <p className="text-slate-500">
              No customer accounts to display at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              Account Overview
            </h1>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>Last updated</p>
            <p className="font-semibold text-slate-700">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Accounts"
            value={totalAccounts}
            subtitle="Active customer accounts"
            delay={0.1}
          />
          <SummaryCard
            title="Total Balance"
            value={`$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            subtitle="Across all accounts"
            delay={0.2}
          />
          <SummaryCard
            title="Transactions"
            value={totalTransactions}
            subtitle="Total transactions"
            delay={0.4}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">
                Filter by Type:
              </label>
              <div className="flex gap-2">
                {["all", "checking", "savings"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === type
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((account, index) => (
            <motion.div
              key={account.account_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getAccountTypeColor(account.account_type || "")}`}
                  >
                    {(account.account_type || "unknown")
                      .charAt(0)
                      .toUpperCase() +
                      (account.account_type || "unknown").slice(1)}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {account.account_id}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text-slate-800">
                    $
                    {Number(account.balance ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Button onClick={generateReport}>Download PDF</Button>

                <div className="space-y-2 py-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Customer ID</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {account.customer_id ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Transactions</span>
                    <span className="font-semibold text-slate-800">
                      {account._count?.Transaction ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, subtitle, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </motion.div>
  );
}
