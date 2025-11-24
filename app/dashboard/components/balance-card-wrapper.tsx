"use client";

import type { AccountType } from "@prisma/client";
import { useHideBalance } from "../providers/hide-balance-provider";
import { BalanceCard } from "./balance-card";

interface BalanceCardWrapperProps {
  userBalance: number;
  account_type: AccountType;
  monthIncome?: number;
  monthExpense?: number;
}

export function BalanceCardWrapper(props: BalanceCardWrapperProps) {
  const { hideBalance } = useHideBalance();

  return <BalanceCard {...props} hidden={hideBalance} />;
}
