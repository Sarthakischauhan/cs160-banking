import { Button } from "@/components/ui/button";
import { FilterInput, FilterRange } from "../components/filters";
import { TransactionsTable } from "./components/transactions-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Delete later when connected to real data
const sampleTransactions = [
  {
    transaction_id: "c3f1a3b4-49c2-4f7d-8a9b-8f9a7c2b1a01",
    account_id: "a6e8c4d1-7e42-4c3b-8df3-4f2cde7a9e13",
    customer_id: "d2c1b9a5-9c73-4e5b-bd59-1a3e6b2b3a90",
    amount: 1250.75,
    amount_after_transaction: 3420.1,
    transaction_status: "Completed",
    transaction_type: "Deposit",
    created_at: new Date("2025-10-01T10:32:00Z"),
  },
  {
    transaction_id: "b9a1f4c2-81f5-42a8-b5f1-9a21b3a93d50",
    account_id: "a6e8c4d1-7e42-4c3b-8df3-4f2cde7a9e13",
    customer_id: "d2c1b9a5-9c73-4e5b-bd59-1a3e6b2b3a90",
    amount: -220.5,
    amount_after_transaction: 3199.6,
    transaction_status: "Completed",
    transaction_type: "Withdrawal",
    created_at: new Date("2025-10-03T15:12:00Z"),
  },
  {
    transaction_id: "f8e4b231-0c8f-4d83-917f-9136a5c4a2d0",
    account_id: "6f2b4e6a-98a7-4f62-a0cf-8e2c71a9f1b2",
    customer_id: "a3c9f4d2-1b7f-4f60-baf1-5a7a3b2c4a70",
    amount: -75.25,
    amount_after_transaction: 1024.75,
    transaction_status: "Completed",
    transaction_type: "Payment",
    created_at: new Date("2025-09-28T09:45:00Z"),
  },
  {
    transaction_id: "d1a9b5f8-c45f-4d31-8b92-7f6d1e9f4a50",
    account_id: "6f2b4e6a-98a7-4f62-a0cf-8e2c71a9f1b2",
    customer_id: "a3c9f4d2-1b7f-4f60-baf1-5a7a3b2c4a70",
    amount: 1000.0,
    amount_after_transaction: 2024.75,
    transaction_status: "Pending",
    transaction_type: "Deposit",
    created_at: new Date("2025-10-10T13:05:00Z"),
  },
  {
    transaction_id: "f4b6e2c7-9d1a-4a31-bc7f-2d9a6b8f7a22",
    account_id: "83e2b7a1-0d35-4b8d-84d7-bc92f7a9a210",
    customer_id: "d9a5b7e3-5b41-4a23-9d82-4b3f9a7e4b92",
    amount: -340.0,
    amount_after_transaction: 657.8,
    transaction_status: "Failed",
    transaction_type: "Transfer",
    created_at: new Date("2025-10-12T19:40:00Z"),
  },
  {
    transaction_id: "e3c2d9a5-9a1b-4c2e-bb73-5f6a1a9f9b10",
    account_id: "83e2b7a1-0d35-4b8d-84d7-bc92f7a9a210",
    customer_id: "d9a5b7e3-5b41-4a23-9d82-4b3f9a7e4b92",
    amount: 200.0,
    amount_after_transaction: 857.8,
    transaction_status: "Completed",
    transaction_type: "Deposit",
    created_at: new Date("2025-10-13T08:30:00Z"),
  },
];

export default function TransactionsPage() {
  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold">Transactions</h1>
        <div className="py-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div className="w-full h-20 grid grid-cols-3 gap-4 py-4">
            <FilterInput
              inputProps={{
                label: "Search by ID",
                placeholder: "Enter Transaction/Account ID",
                type: "text",
              }}
            />
            <FilterRange
              rangeProps={{
                label: "Amount Range",
                minPlaceholder: "Min Amount",
                maxPlaceholder: "Max Amount",
                type: "text",
                prefix: "$",
              }}
            />
            <FilterRange
              rangeProps={{
                label: "Date Range",
                minPlaceholder: "Start Date",
                maxPlaceholder: "End Date",
                type: "date",
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 my-4">
            <FilterRange
              rangeProps={{
                label: "Time Range",
                minPlaceholder: "Start Time",
                maxPlaceholder: "End Time",
                type: "time",
              }}
            />
            <div>
              <Label className="mb-2">Status</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Type</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Completed">Deposit</SelectItem>
                  <SelectItem value="Pending">Withdrawal</SelectItem>
                  <SelectItem value="Failed">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>Apply Filters</Button>
        </div>
        <p className="font-bold w-full border-b-2">Transactions</p>
        <div className="w-full h-[calc(100%-100px)] flex justify-center items-center py-6">
          <TransactionsTable transactions={sampleTransactions} />
        </div>
      </div>
    </div>
  );
}
