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
import { sampleTransactions } from "../dummydata/data";
import { prisma } from "@/prisma/prisma";

export default async function TransactionsPage() {
    const data = await prisma.transaction.findMany()
    console.log(data)

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
          <TransactionsTable transactions={data} />
        </div>
      </div>
    </div>
  );
}
