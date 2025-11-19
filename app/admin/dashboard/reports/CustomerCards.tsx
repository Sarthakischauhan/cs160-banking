"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

type CustomerCardsProps = {
  reportData: {
    account_id: string;
    customer_id?: string;
    account_type?: string;
    balance?: number;
    _count?: { Transaction?: number };
  }[];
};

export default function CustomerCards({ reportData }: CustomerCardsProps) {
  if (!reportData || reportData.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No customer data available.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {reportData.map((a) => (
        <motion.div
          key={a.account_id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="p-4 space-y-2 border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">
              Account #{a.account_id}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Customer:</strong> {a.customer_id ?? "N/A"}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {a.account_type
                  ? a.account_type.charAt(0).toUpperCase() + a.account_type.slice(1)
                  : "Unknown"}
              </p>
              <p>
                <strong>Balance:</strong> ${Number(a.balance ?? 0).toFixed(2)}
              </p>
              <p>
                <strong>Transactions:</strong>{" "}
                {a._count?.Transaction ?? 0}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
