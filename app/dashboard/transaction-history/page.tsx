import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { TransactionTableCard } from "./components/transactiontable-card";

const transactions = [
  {
    id: "tx001",
    date: "2025-09-25",
    description: "Starbucks Coffee",
    amount: -5.75,
    type: "debit",
    category: "Food & Drink",
  },
  {
    id: "tx002",
    date: "2025-09-24",
    description: "Paycheck",
    amount: 1500.0,
    type: "credit",
    category: "Income",
  },
  {
    id: "tx003",
    date: "2025-09-23",
    description: "Amazon Purchase",
    amount: -42.99,
    type: "debit",
    category: "Shopping",
  },
  {
    id: "tx004",
    date: "2025-09-22",
    description: "Netflix Subscription",
    amount: -15.99,
    type: "debit",
    category: "Entertainment",
  },
  {
    id: "tx005",
    date: "2025-09-21",
    description: "Grocery Store",
    amount: -120.45,
    type: "debit",
    category: "Groceries",
  },
  {
    id: "tx006",
    date: "2025-09-20",
    description: "Electric Bill",
    amount: -60.0,
    type: "debit",
    category: "Utilities",
  },
  {
    id: "tx007",
    date: "2025-09-19",
    description: "Transfer from Savings",
    amount: 200.0,
    type: "credit",
    category: "Transfer",
  },
  {
    id: "tx008",
    date: "2025-09-18",
    description: "Gas Station",
    amount: -35.25,
    type: "debit",
    category: "Transportation",
  },
  {
    id: "tx009",
    date: "2025-09-17",
    description: "Spotify Subscription",
    amount: -9.99,
    type: "debit",
    category: "Entertainment",
  },
  {
    id: "tx010",
    date: "2025-09-16",
    description: "Coffee with Friends",
    amount: -12.5,
    type: "debit",
    category: "Food & Drink",
  },
];

export default function TransactionHistoryPage() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="w-full h-full">
            <div className="p-10">
              <h1 className="text-4xl">Transaction History</h1>
            </div>
            <div className="justify-items-center">
              <TransactionTableCard transactions={transactions} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
