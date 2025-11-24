"use client";

import type { AccountType } from "@prisma/client";
import { useState } from "react";
import type { RecentTransferUser } from "@/lib/transactions";
import { BalanceCardWrapper } from "../../components/balance-card-wrapper";
import { RecentTransfersCard } from "./recent-transfers-card";
import { TransferCard } from "./transfer-card";

type TransferPageProps = {
  account: {
    balance: number;
    account_type: AccountType;
  };
  activeId: string;
  recentRecipients: RecentTransferUser[];
};

export function TransferPage({
  account,
  activeId,
  recentRecipients,
}: TransferPageProps) {
  const [selected, setSelected] = useState<SearchRecipient | null>(null);

  return (
    <>
      <div className="p-10 space-y-6">
        <h1 className="text-4xl font-bold">Transfer</h1>

        <div className="flex gap-3">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-3 w-fit">
            <div className="flex-1">
              <BalanceCardWrapper
                userBalance={account.balance}
                account_type={account.account_type}
              />
            </div>

            <div className="flex-1">
              <RecentTransfersCard
                onSelect={({ account_id, name }: SearchRecipient) =>
                  setSelected({ account_id, name: name })
                }
                recentRecipients={recentRecipients}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1">
            <div className="w-full max-w-xl">
              <TransferCard
                selectedRecipient={selected}
                activeAccountId={activeId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
