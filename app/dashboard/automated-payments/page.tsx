import { DepositCard } from "./components/deposit-card";
import { BalanceCard } from "../components/balance-card";
import { getAccount } from "@/lib/accounts";
import { handleCurrentId } from "@/lib/user";

export default async function DepositPage() {
  const activeId = (await handleCurrentId()) ?? "";
  const account = await getAccount({ account_id: activeId });

  return (
    <>
      <div className="p-4 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold">Automated Payments</h1>
      </div>

      <div className="px-4 sm:px-10">
        <div className="grid grid-cols-1 gap-6 w-full">
          
          <div className="h-fit">
            <BalanceCard userBalance={Number(account?.balance)} account_type={account?.account_type} />
          </div>
          
          <div className="h-fit w-full">
            {account && <DepositCard account_id={activeId} />}
          </div>
        </div>
      </div>
    </>
  );
}