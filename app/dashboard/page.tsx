import { WelcomeCard } from "./components/welcome-card";
import { BalanceCard } from "./components/balance-card";
import { NotificationCard } from "./components/notification-card";
import { TransactionCard } from "./components/transaction-card";
import { HistgraphCard } from "./components/histgraph-card";
import { UpcomingCard } from "./components/upcoming-card";
import { ATMCard } from "./components/atm-card";
import { AccountSelect } from "./components/account-select";
import { useEffect } from "react";

type Account = { // Makes structure to hold account info
  customer_id: string | null;
  balance: number | null;
}
export default function Dashboard() { // Initilize with grabbing info from api Account 
  const [account, setAccount] = useState< Account | null>(null);

    useEffect(() => {
    async function fetchProfile() {
    const res = await fetch("/api/account");
    if (res.status === 401) {
      window.location.href = "/auth/login";
      return;
    }

    const accountsData = await res.json();
    const firstAccount = accountsData[0]; // gets the first account info for now will change in the future

    setAccount(firstAccount);
}
    fetchProfile();
}, []);

  return (
    <>
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
                userBalance={account?.balance ?? 0} //Sets balance to info from first account
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
function useState<T>(arg0: null): [any, any] {
  throw new Error("Function not implemented.");
}

