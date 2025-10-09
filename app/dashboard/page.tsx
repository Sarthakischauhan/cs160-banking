import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { WelcomeCard } from "./components/welcome-card";
import { BalanceCard } from "./components/balance-card";
import { NotificationCard } from "./components/notification-card";
import { TransactionCard } from "./components/transaction-card";
import { HistgraphCard } from "./components/histgraph-card";
import { UpcomingCard } from "./components/upcoming-card";
import { ATMCard } from "./components/atm-card";
import { AccountSelect } from "./components/account-select";
import { auth0 } from "@/lib/auth0";
export default async function Dashboard() {
  const session = await auth0.getSession()
  console.log(session) 
  return (
    <>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <div className="grid grid-cols-3 m-4">
            <AccountSelect />
          </div>

          {/* ROW 1 */}
          <div className="mx-4 my-2">
            <WelcomeCard />
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
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
