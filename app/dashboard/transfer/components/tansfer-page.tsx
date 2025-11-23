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
        account_type: AccountType
    },
    activeId:string;
    recentRecipients: RecentTransferUser[];
}

export function TransferPage({account, activeId, recentRecipients} : TransferPageProps) {
  const [selected, setSelected] = useState<selectedRecipient | null>(null);

  return (
    <>
      <div className="p-10 space-y-6">
        <h1 className="text-4xl font-bold">Transfer</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-fit">
            <div className="flex-1">
              <BalanceCardWrapper userBalance={account.balance} account_type={account.account_type}/>
            </div>

            <div className="flex-1">
              <RecentTransfersCard
                onSelect={({account_id, customer_name}: selectedRecipient) => setSelected({account_id, customer_name})}
                recentRecipients={recentRecipients}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex">
            <div className="w-full max-w-xl">
              <TransferCard selectedRecipient={selected} activeAccountId={activeId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
