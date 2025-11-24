import { redirect } from "next/navigation";
import { getAccount } from "@/lib/accounts";
import { getRecentTransactions } from "@/lib/transactions";
import { handleCurrentId } from "@/lib/user";
import { TransferPage } from "./components/tansfer-page";

export default async function Page() {
  const activeId = (await handleCurrentId()) ?? "";
  const account = await getAccount({ account_id: activeId });

  const recentTransactions = await getRecentTransactions({
    account_id: activeId,
  });
  if (account) {
    const normalizedAccount = {
      balance: Number(account.balance),
      account_type: account.account_type,
    };
    return (
      <>
        <TransferPage
          account={normalizedAccount}
          activeId={activeId}
          recentRecipients={recentTransactions}
        />
      </>
    );
  }
}
