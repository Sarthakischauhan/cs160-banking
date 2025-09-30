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

export default function Dashboard() {
  return (
    <>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        <SidebarInset>
          {/* ROW 1 */}
          <div className="mx-4 my-2">
            <WelcomeCard />
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-3">
            <div className="ml-4 mr-2">
              <BalanceCard
                userBalance={1000}
                monthIncome={500}
                monthExpense={1000}
              />
            </div>
            <div className="col-span-2 mr-4 ml-2">
              <NotificationCard />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-2 my-2">
            <div className="ml-4 mr-2">
              <TransactionCard />
            </div>
            <div className="mr-4 ml-2">
              <HistgraphCard />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
