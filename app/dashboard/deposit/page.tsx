import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAccount } from "@/lib/accounts";
import { handleCurrentId } from "@/lib/user";
import { AppSidebar } from "../components/app-sidebar";
import { BalanceCardWrapper } from "../components/balance-card-wrapper";
import { DepositCard } from "./components/deposit-card";

export default async function DepositPage() {
  const activeId = (await handleCurrentId()) ?? "";
  const account = await getAccount({ account_id: activeId });

  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl font-bold">Deposit</h1>
      </div>
      <div className="px-10">
        <div className="flex h-60 p-2">
          <BalanceCardWrapper
            userBalance={Number(account?.balance)}
            account_type={account?.account_type}
          />
        </div>
        <div className="flex h-fit p-2">
          {account && <DepositCard account_id={activeId} />}
        </div>
      </div>
    </>
  );
}
