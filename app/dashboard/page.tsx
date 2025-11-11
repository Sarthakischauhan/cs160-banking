import { WelcomeCard } from "./components/welcome-card";
import { BalanceCard } from "./components/balance-card";
import { NotificationCard } from "./components/notification-card";
import { TransactionCard } from "./components/transaction-card";
import { HistgraphCard } from "./components/histgraph-card";
import { UpcomingCard } from "./components/upcoming-card";
import { ATMCard } from "./components/atm-card";
import { AccountSelect } from "./components/account-select";

import { getUserData, handleCurrentId } from "@/lib/user"
import { auth0 } from "@/lib/auth0"
import { ProfileCompletion } from "./components/onboard/ProfileCompletion";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AccountType } from "@prisma/client";


interface DashboardParams {
  [key: string]: string | undefined;
}


type DashboardProps = {
  searchParams: DashboardParams
}

export default async function Page({ searchParams } : DashboardProps) {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/");
  }
  const user = await getUserData({ userId: session.user.sub });
  if (!user?.isOnboarded) {
    return <ProfileCompletion />;
  }

  const accountNames = user?.accounts ?? [];
  const currentAccountId = await handleCurrentId()

  const accountId = currentAccountId ?? accountNames[0]?.account_id
  const currentAccount = accountNames.find((account) => account.account_id === accountId)
  

  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-3 m-4">
        {accountNames ? (
          <div className="flex gap-2">
          <AccountSelect 
            accounts={accountNames} 
            currentAccountId={accountId} 
          />
          <Button asChild>
            <Link href={"/dashboard/create-account"}><Plus width={3} height={3}/></Link>
          </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href={"/dashboard/create-account"}>Don't have an account ? Create one</Link>
          </Button>
        )}
      </div>

      {/* ROW 1 */}
      <div className="mx-4 my-2">
        <WelcomeCard firstName={user.firstName as string} />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-4 h-fit">
        <div className="col-span-1 ml-4 mr-2">
          {currentAccount && (
            <BalanceCard
              userBalance={(currentAccount.balance)}
              monthIncome={1400}
              monthExpense={1000}
              account_type={currentAccount.account_type === "SAVINGS" ? AccountType.SAVINGS : AccountType.CHECKING }
            />
          )}
        </div>
        <div className="col-span-3 mr-4 ml-2">
          <TransactionCard  transactions={(user.transactions as Record<string, any[]>)[accountId]} activeAccountId={accountId} />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-2 my-2 h-fit">
        <div className="ml-4 mr-2">
          { "notifications" in user && (
            <NotificationCard notifications={user.notifications} />
          )}
        </div>
        <div className="mr-4 ml-2">
          <HistgraphCard  />
        </div>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-7 my-2 h-fit">
        <div className="ml-4 col-span-3 mr-2">
          <UpcomingCard  />
        </div>
        <div className="mr-2 ml-2 col-span-2">
          <ATMCard  />
        </div>
      </div>
    </>
  );
}
