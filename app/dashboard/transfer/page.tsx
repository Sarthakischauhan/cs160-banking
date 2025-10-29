"use client";

import { BalanceCard } from "../components/balance-card";
import { TransferCard } from "./components/transfer-card";
import { RecentTransfersCard } from "./components/recent-transfers-card";
import { useState } from "react";

export default function TransferPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="p-10 space-y-6">
        <h1 className="text-4xl font-bold">Transfer</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-fit">
            <div className="flex-1">
              <BalanceCard userBalance={1000} />
            </div>

            <div className="flex-1">
              <RecentTransfersCard onSelect={setSelected} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex">
            <div className="w-full max-w-xl">
              <TransferCard selectedRecipient={selected} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
