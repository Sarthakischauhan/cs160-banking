"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
=======
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2
import { BalanceCard } from "../components/balance-card";
import { TransferCard } from "./components/transfer-card";
import { RecentTransfersCard } from "./components/recent-transfers-card";
type Customer = {
  customer_id: string | null;
  balance: number | null;
};

export default function TransferPage() {
<<<<<<< HEAD
    const [selected, setSelected] = useState<string | null>(null);
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
=======
  const [selected, setSelected] = useState<string | null>(null);
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2

  return (
    <>
      <div className="p-10 space-y-6">
        <h1 className="text-4xl font-bold">Transfer</h1>

<<<<<<< HEAD
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-6 w-fit">
                <div className="flex-1">
                  <BalanceCard userBalance={customer?.balance ?? 0} />
                </div>
=======
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-fit">
            <div className="flex-1">
              <BalanceCard userBalance={1000} />
            </div>
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2

            <div className="flex-1">
              <RecentTransfersCard onSelect={setSelected} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex">
            <div className="w-full max-w-xl">
              <TransferCard selectedRecipient={selected} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
