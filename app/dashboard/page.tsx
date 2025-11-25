import { WelcomeCard } from "./components/welcome-card";
import { BalanceCardWrapper } from "./components/balance-card-wrapper";
import { NotificationCard } from "./components/notification-card";
import { TransactionCard } from "./components/transaction-card";
import { HistgraphCard } from "./components/histgraph-card";
import { UpcomingCard } from "./components/upcoming-card";
import { ATMCard } from "./components/atm-card";
import { ReportCard } from "./components/report-card";
import { AccountSelect } from "./components/account-select";
import { getUserData, handleCurrentId } from "@/lib/user";
import { auth0, getRole } from "@/lib/auth0";
import { ProfileCompletion } from "./components/onboard/ProfileCompletion";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AccountType } from "@prisma/client";
import { cookies } from "next/headers";
import { AccountSettingsDropdown } from "./components/account-settings-gear";

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
    (account) => account.account_id === accountId
  );

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 m-4 gap-4 md:gap-0">
        {accountNames ? (
          <div className="flex items-center gap-2">
            <AccountSettingsDropdown accountId={accountId} user={user} />
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
        <div className="hidden md:block" />
        <div className="flex items-center md:justify-end gap-5">
          {getRole(session).includes("Admin") ? (
            <Button className="w-full md:w-[200] hover:cursor-pointer">
              <a
                href="/admin/dashboard"
                className="rounded-lg text-center py-2 hover:bg-opacity-80"
              >
                View Admin Dashboard
              </a>
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="mx-4 my-2">
        <WelcomeCard firstName={user.firstName as string} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 h-fit gap-4 mx-4">
        {/* BalanceCardWrapper: Full width on mobile, col-span-1 on desktop */}
        <div className="md:col-span-1">
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

        <div className="md:col-span-3">
          <TransactionCard
            transactions={user.transactions[accountId]}
            activeAccountId={accountId}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 my-2 h-fit gap-4 mx-4">
        {/* Both children take full width on mobile, and col-span-1 on desktop */}
        <div>
          <NotificationCard notifications={user?.notifications} />
        </div>
        <div>
          <HistgraphCard />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 my-2 h-fit gap-4 mx-4">
        {/* UpcomingCard: Full width on mobile, col-span-3 on desktop */}
        <div className="md:col-span-3">
          <UpcomingCard />
        </div>
        <div className="md:col-span-2">
          <ATMCard />
        </div>
        <div className="md:col-span-2">
          <ReportCard />
        </div>
      </div>
    </>
  );
}
