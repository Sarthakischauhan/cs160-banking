import { getAccount } from "@/lib/accounts";
import { handleCurrentId } from "@/lib/user";
import { TransferPage } from "./components/tansfer-page";
import { redirect } from "next/navigation";
import { getRecentTransactions } from "@/lib/transactions";

export default async function Page() {
  const activeId = (await handleCurrentId()) ?? "";
  const account = await getAccount({ account_id: activeId });

  const recentTransactions = await getRecentTransactions({account_id: activeId})
  if (account){
    const normalizedAccount = {
      balance: Number(account.balance), 
      account_type: account.account_type
    }
    return ( 
      <>
        <TransferPage account={normalizedAccount} activeId={activeId} recentRecipients={recentTransactions} />
      </>
    );
  }

  return redirect("/dashboard")
}
