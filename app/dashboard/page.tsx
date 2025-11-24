import { AccountType } from "@prisma/client";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth0, getRole } from "@/lib/auth0";
import { getUserData, handleCurrentId } from "@/lib/user";
import { AccountSelect } from "./components/account-select";
import { ATMCard } from "./components/atm-card";
import { BalanceCardWrapper } from "./components/balance-card-wrapper";
import { HistgraphCard } from "./components/histgraph-card";
import { NotificationCard } from "./components/notification-card";
import { ProfileCompletion } from "./components/onboard/ProfileCompletion";
import { ReportCard } from "./components/report-card";
import { TransactionCard } from "./components/transaction-card";
import { UpcomingCard } from "./components/upcoming-card";
import { WelcomeCard } from "./components/welcome-card";

interface DashboardParams {
  [key: string]: string | undefined;
}

type DashboardProps = {
  searchParams: DashboardParams;
};

export default async function Page({ searchParams }: DashboardProps) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/");
  }
  const user = await getUserData({ userId: session.user.sub });
  if (!user?.isOnboarded) {
    return <ProfileCompletion />;
  }

  const accountNames = user?.accounts ?? [];
  const currentAccountId = await handleCurrentId();

  const accountId = currentAccountId ?? accountNames[0]?.account_id;
  const currentAccount = accountNames.find(
    (account) => account.account_id === accountId,
  );

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
              <Link href={"/dashboard/create-account"}>
                <Plus width={3} height={3} />
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link href={"/dashboard/create-account"}>
              Don't have an account ? Create one
            </Link>
          </Button>
        )}
        <div />
        {getRole(session).includes("Admin") ? (
          <div className="flex justify-end">
            <Button className="w-[200] hover:cursor-pointer">
              <a
                href="/admin/dashboard"
                className="bg-black text-white rounded-lg text-center py-2 hover:bg-opacity-80"
              >
                View Admin Dashboard
              </a>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <div></div>
      </div>

      {/* ROW 1 */}
      <div className="mx-4 my-2">
        <WelcomeCard firstName={user.firstName as string} />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-4 h-fit">
        <div className="col-span-1 ml-4 mr-2">
          {currentAccount && (
            <BalanceCardWrapper
              userBalance={currentAccount.balance}
              monthIncome={1400}
              monthExpense={1000}
              account_type={
                currentAccount.account_type === "SAVINGS"
                  ? AccountType.SAVINGS
                  : AccountType.CHECKING
              }
            />
          )}
        </div>
        <div className="col-span-3 mr-4 ml-2">
          <TransactionCard
            transactions={user.transactions[accountId]}
            activeAccountId={accountId}
          />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-2 my-2 h-fit">
        <div className="ml-4 mr-2">
          <NotificationCard notifications={user?.notifications} />
        </div>
        <div className="mr-4 ml-2">
          <HistgraphCard />
        </div>
      </div>

      {/* ROW 4 */}
      <div className="grid grid-cols-7 my-2 h-fit">
        <div className="ml-4 col-span-3 mr-2">
          <UpcomingCard />
        </div>
        <div className="mr-2 ml-2 col-span-2">
          <ATMCard />
        </div>
        <div className="mr-4 ml-2 col-span-2">
          <ReportCard />
        </div>
      </div>
    </>
  );
}
