"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleHideBalanceAction } from "./actions";
import { useHideBalance } from "../providers/hide-balance-provider";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";

interface SettingsClientProps {
	initialTheme: string;
}

export function SettingsClient({
	initialTheme,
}: SettingsClientProps) {
	const { hideBalance, setHideBalance } = useHideBalance();
	const [isPendingBalance, startBalanceTransition] = useTransition();

	const handleBalanceToggle = () => {
		const newValue = !hideBalance;

		// Optimistically update the UI immediately
		setHideBalance(newValue);

		// Then update the server
		startBalanceTransition(async () => {
			await toggleHideBalanceAction(newValue);
		});
	};

	return (
		<div className="p-8 flex justify-center">
			<Card className="w-full max-w-2xl border border-gray-300 dark:border-gray-700 shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
				</CardHeader>

				<CardContent className="space-y-8">
					{/* Theme Toggle */}
					<div className="flex items-center justify-between py-4">
						<div>
							<Label className="text-lg font-medium">Theme</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Switch between light and dark mode.
							</p>
						</div>

						<ThemeToggleButton />
					</div>

					<div className="border-t border-gray-300 dark:border-gray-700" />

					{/* Hide Balance Toggle */}
					<div className="flex items-center justify-between py-4">
						<div>
							<Label className="text-lg font-medium">Hide Balance</Label>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								When enabled, account balances are blurred or hidden.
							</p>
						</div>
						<Switch checked={hideBalance} onClick={handleBalanceToggle} disabled={isPendingBalance} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
