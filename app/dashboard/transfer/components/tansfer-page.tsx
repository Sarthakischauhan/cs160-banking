"use client";

import { BalanceCardWrapper } from "../../components/balance-card-wrapper";
import { TransferCard } from "./transfer-card";
import { RecentTransfersCard } from "./recent-transfers-card";
import { useState } from "react";
import { AccountType } from "@prisma/client";
import type { RecentTransferUser } from "@/lib/transactions";

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
    <div className="p-4 sm:p-10 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold">Transfer</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex-none">
            <BalanceCardWrapper
              userBalance={account.balance}
              account_type={account.account_type}
            />
          </div>

          <div className="md:hidden">
            <div className="w-full max-w-full lg:max-w-xl mx-auto">
              <TransferCard
                selectedRecipient={selected}
                activeAccountId={activeId}
              />
            </div>
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

        <div className="hidden md:flex flex-1">
          <div className="w-full max-w-full lg:max-w-xl mx-auto md:mx-0">
            <TransferCard
              selectedRecipient={selected}
              activeAccountId={activeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
