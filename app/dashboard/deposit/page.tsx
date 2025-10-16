"use client";

import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { DepositCard } from "./components/deposit-card";
import { BalanceCard } from "../components/balance-card";

type Customer = {
  customer_id: string | null;
  balance: number | null;
};

export default function DepositPage({ roles }: { roles: string[] }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/account");
      if (res.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      const data = await res.json();
      const account = data[0]; 
      console.log("Fetched account:", account);

      if (!account.customer_id) {
        console.error("No customer_id found!");
        return;
      }

      setCustomer({
        customer_id: account.customer_id,
        balance: Number(account.balance), 
      });
    }

    fetchProfile();
  }, []);

  async function createProfile(customer_id: string) {
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id,
        initial_balance: 0,
      }),
    });

    const account = await res.json();

    setCustomer({
      customer_id: account.customer_id,
      balance: Number(account.balance),
    });

    console.log("Created account balance:", account.balance);
    return account;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-10">
          <h1 className="text-4xl font-bold">Deposit</h1>
        </div>
        <div className="flex h-60 p-2 justify-center">
          <BalanceCard userBalance={customer?.balance ?? 0} />
        </div>
        <div className="flex h-fit p-2 justify-center">
          <DepositCard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
