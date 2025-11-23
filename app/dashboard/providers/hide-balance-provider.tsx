"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface HideBalanceContextType {
	hideBalance: boolean;
	setHideBalance: (value: boolean) => void;
	toggleHideBalance: () => void;
}

const HideBalanceContext = createContext<HideBalanceContextType | undefined>(
	undefined,
);

interface HideBalanceProviderProps {
	children: ReactNode;
	initialHideBalance: boolean;
}

export function HideBalanceProvider({
	children,
	initialHideBalance,
}: HideBalanceProviderProps) {
	const [hideBalance, setHideBalance] = useState(initialHideBalance);

	// On mount, sync the cookie value (server source of truth) to localStorage
	useEffect(() => {
		// Update localStorage to match the server cookie value
		localStorage.setItem("hideBalance", String(initialHideBalance));
		// Ensure state matches the cookie on mount
		setHideBalance(initialHideBalance);
	}, [initialHideBalance]);

	// Sync with localStorage for persistence across tabs
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "hideBalance") {
				setHideBalance(e.newValue === "true");
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Update localStorage when state changes
	useEffect(() => {
		localStorage.setItem("hideBalance", String(hideBalance));
		// Dispatch custom event for same-tab synchronization
		window.dispatchEvent(
			new CustomEvent("hideBalanceChange", { detail: hideBalance }),
		);
	}, [hideBalance]);

	const toggleHideBalance = () => {
		setHideBalance((prev) => !prev);
	};

	return (
		<HideBalanceContext.Provider
			value={{ hideBalance, setHideBalance, toggleHideBalance }}
		>
			{children}
		</HideBalanceContext.Provider>
	);
}

export function useHideBalance() {
	const context = useContext(HideBalanceContext);
	if (context === undefined) {
		throw new Error(
			"useHideBalance must be used within a HideBalanceProvider",
		);
	}
	return context;
}
