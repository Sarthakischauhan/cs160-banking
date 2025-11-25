"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminReportCard } from "@/app/dashboard/components/admin-report-card";

type ReportAccount = {
  account_id: string;
  account_type?: string | null;
  balance?: number | null;
  Customer?: {
    customer_id: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  } | null;
  Transaction_Transaction_account_id2ToAccount?: Array<{
    transaction_id: string;
    amount: number;
    transaction_type: string;
    transaction_status: string;
    created_at: string;
  }>;
};

export default function BankManagerDashboard() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("balance");
  const [loading, setLoading] = useState(true);
  const [nameQuery, setNameQuery] = useState("");

  async function fetchAccounts() {
    try {
      setLoading(true);
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      if (Array.isArray(data)) setReportData(data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Summary metrics
  const totalAccounts = reportData.length;
  const totalBalance = reportData.reduce(
    (sum, a) => sum + Number(a.balance ?? 0),
    0
  );

  const totalTransactions = reportData.reduce(
    (sum, acc) => sum + (acc.Transaction_Transaction_account_id2ToAccount?.length ?? 0),
    0
  );


  const filteredData = (reportData ?? [])
    .filter((acc) => {
      // account-type filter
      const type = (acc.account_type ?? "").toLowerCase();
      if (filter !== "all" && type !== filter.toLowerCase()) return false;

      // name filter
      const q = nameQuery.trim().toLowerCase();
      if (!q) return true;

      const first = (acc.Customer?.first_name ?? "").toLowerCase();
      const last = (acc.Customer?.last_name ?? "").toLowerCase();
      const full = `${first} ${last}`.trim();
      const email = (acc.Customer?.email ?? "").toLowerCase();

      return (
        first.includes(q) ||
        last.includes(q) ||
        full.includes(q) ||
        email.includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "balance_desc") {
        return Number(b.balance ?? 0) - Number(a.balance ?? 0); // high → low
      }
      if (sortBy === "balance_asc") {
        return Number(a.balance ?? 0) - Number(b.balance ?? 0); // low → high
      }
      return 0;
    });



  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking": return "bg-blue-100 text-blue-700 border-blue-200";
      case "savings": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg rounded-xl p-12 text-center shadow-sm border border">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text mb-2">No Data Available</h3>
            <p className="text-">No customer accounts to display at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text mb-1">Account Overview</h1>
          </div>
          <div className="text-right text-sm text">
            <p>Last updated</p>
            <p className="font-semibold text">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Total Accounts" value={totalAccounts} subtitle="Active customer accounts" delay={0.1} />
          <SummaryCard title="Total Balance" value={`$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} subtitle="Across all accounts" delay={0.2} />
          <SummaryCard title="Transactions" value={totalTransactions} subtitle="Total transactions" delay={0.4} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text">Filter by Type:</label>
            <div className="flex gap-2">
              {["all", "checking", "savings"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type ? "bg " : "bg text hover:bg"
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Name search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-64 px-3 py-2 rounded-lg border border text-sm focus:outline-none focus:ring-2 focus:ring"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border text-sm bg"
            >
              <option value="balance_desc">Balance: High → Low</option>
              <option value="balance_asc">Balance: Low → High</option>
            </select>

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
              className="bg rounded-xl shadow-sm border border overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getAccountTypeColor(account.account_type || "")}`}
                  >
                    {(account.account_type || "unknown").charAt(0).toUpperCase() +
                      (account.account_type || "unknown").slice(1)}
                  </span>
                  <span className="text-xs font-mono text">{account.account_id}</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text mb-1">Current Balance</p>
                  <p className="text-3xl font-bold text">
                    ${Number(account.balance ?? 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <AdminReportCard
                  customer_id={account.Customer?.customer_id || ""}
                  account_id={account.account_id}
                />
                <div className="space-y-2 py-3 border-t border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text">Customer Name</span>
                    <span className="font-semibold text font-mono">{`${account.Customer?.first_name ?? ""} ${account.Customer?.last_name ?? ""}`.trim() || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text">Transactions</span>
                    <span className="font-semibold text"> {account.Transaction_Transaction_account_id2ToAccount?.length ?? 0}</span>
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
      className="bg-background rounded-xl p-6 shadow-sm border border-border"

    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text">{value}</p>
      <p className="text-xs text mt-1">{subtitle}</p>
    </motion.div>
  );
}