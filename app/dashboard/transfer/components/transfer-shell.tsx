"use client";

import { useState } from "react";
import { RecentTransfersCard } from "./recent-transfers-card";
import { TransferCard } from "./transfer-card";

export default function TransferShell({ account_id } : { account_id: string }){
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-6 w-fit">
        <div className="flex-1">
          <RecentTransfersCard onSelect={setSelected} />
        </div>
      </div>

      <div className="flex">
        <div className="w-full max-w-xl">
          <TransferCard selectedRecipient={selected} activeAccountId={account_id} />
        </div>
      </div>
    </div>
  )
}
