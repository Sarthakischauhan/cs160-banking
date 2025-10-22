import { WelcomeCard } from "./components/welcome-card";
import { BalanceCard } from "./components/balance-card";
import { NotificationCard } from "./components/notification-card";
import { TransactionCard } from "./components/transaction-card";
import { HistgraphCard } from "./components/histgraph-card";
import { UpcomingCard } from "./components/upcoming-card";
import { ATMCard } from "./components/atm-card";
import { AccountSelect } from "./components/account-select";
import { getUserData } from "@/lib/user"
import { auth0 } from "@/lib/auth0"
import { ProfileCompletion } from "./components/onboard/ProfileCompletion";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth0.getSession()

  if (!session){
    redirect("/")
  }
  const user = await getUserData({userId: session.user.sub})

  // console.log(user)
  if (!user?.isOnboarded ){
    return <ProfileCompletion />
  }
  const accountNames = user?.accounts;
  return (
    <>
      {/* Header */}
      <div className="grid grid-cols-3 m-4">
        {
        !accountNames ? 
        <AccountSelect accountNames={accountNames}/> : 
        <Button><Link href={"/create-account"}>Don't have an account ? Create one</Link></Button>
        }
      </div>

      {/* ROW 1 */}
      <div className="mx-4 my-2">
        <WelcomeCard firstName={user?.firstName} />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-4 h-fit">
        <div className="col-span-1 ml-4 mr-2">
          <BalanceCard
            userBalance={1000}
            monthIncome={1400}
            monthExpense={1000}
          />
        </div>
        <div className="col-span-3 mr-4 ml-2">
          <NotificationCard />
        </div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-2 my-2 h-fit">
        <div className="ml-4 mr-2">
          <TransactionCard />
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
      </div>
    </>
  );
}
