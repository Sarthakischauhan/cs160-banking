"use client";

import { BalanceCard } from "./balance-card";
import { useHideBalance } from "../providers/hide-balance-provider";
import { AccountType } from "@prisma/client";

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
