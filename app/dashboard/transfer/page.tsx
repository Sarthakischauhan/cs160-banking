import { BalanceCard } from "../components/balance-card";
import { getAccount } from "@/lib/accounts";
import { handleCurrentId } from "@/lib/user";
import TransferShell from "./components/transfer-shell";

export default async function TransferPage() {
  const activeId = (await handleCurrentId()) ?? "";
  const account = await getAccount({ account_id: activeId });

  return (
    <>
      <div className="p-10 space-y-6">
        <h1 className="text-4xl font-bold">Transfer</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-fit">
            <div className="flex-1">
              <BalanceCard
                userBalance={Number(account?.balance ?? 0)}
                account_type={account?.account_type}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full max-w-xl">
              <TransferShell account_id={activeId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
