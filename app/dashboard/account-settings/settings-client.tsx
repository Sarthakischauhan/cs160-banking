"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleThemeAction, toggleHideBalanceAction } from "./actions";
import { useHideBalance } from "../providers/hide-balance-provider";

interface SettingsClientProps {
	initialTheme: string;
}

export function SettingsClient({
	initialTheme,
}: SettingsClientProps) {
	const [theme, setTheme] = useState(initialTheme);
	const { hideBalance, setHideBalance } = useHideBalance();
	const [isPendingTheme, startThemeTransition] = useTransition();
	const [isPendingBalance, startBalanceTransition] = useTransition();

	const handleThemeToggle = () => {
		const newTheme = theme === "dark" ? "light" : "dark";

		// Optimistically update the UI immediately
		setTheme(newTheme);

		// Apply theme to document immediately for smooth visual transition
		document.documentElement.className = newTheme;

		// Then update the server
		startThemeTransition(async () => {
			await toggleThemeAction(newTheme);
		});
	};

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

						<button
							type="button"
							onClick={handleThemeToggle}
							disabled={isPendingTheme}
						>
							<Switch checked={theme === "dark"} />
						</button>
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

						<button
							type="button"
							onClick={handleBalanceToggle}
							disabled={isPendingBalance}
						>
							<Switch checked={hideBalance} />
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
