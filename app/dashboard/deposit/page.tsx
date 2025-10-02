import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { DepositCard } from "./components/deposit-card";
import { BalanceCard } from "../components/balance-card";

export default function DepositPage() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-10">
            <h1 className="text-4xl">Deposit</h1>
          </div>
          <div className="flex h-60 p-2 justify-center">
            <BalanceCard userBalance={1000} />
          </div>
          <div className="flex h-fit p-2 justify-center">
            <DepositCard />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
