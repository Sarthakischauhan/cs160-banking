import { Button } from "@/components/ui/button";
import { TextFilter, RangeFilter, SelectFilter } from "../components/filters";
import { TransactionsTable } from "./components/transactions-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { prisma } from "@/prisma/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { getTransactions } from "@/lib/adminData";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = searchParams;
  const firstName = params.firstName ?? "";
  const lastName = params.lastName ?? "";
  const minAmount = params.minAmount ?? "";
  const maxAmount = params.maxAmount ?? "";
  const minDate = params.minDate ?? "";
  const maxDate = params.maxDate ?? "";
  const transactionStatus = params.transactionStatus ?? "";
  const transactionType = params.transactionType ?? "";

  const data = await getTransactions(params);
  console.log(data);

  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Transactions</h1>
        <form method="GET" className="flex flex-col gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div>
            <Button type="submit">Apply Filters</Button>
          </div>
          <div className="w-full h-20 grid grid-cols-4 gap-4 py-4">
            <TextFilter
              label={"First Name"}
              name="firstName"
              value={firstName}
            />
            <TextFilter
              label={"Last Name"}
              name="lastName"
              value={lastName}
            />
            <RangeFilter
              label={"Amount"}
              minName="minAmount"
              maxName="maxAmount"
              minValue={minAmount}
              maxValue={maxAmount}
              minPlaceholder="Minimum Amount"
              maxPlaceholder="Maximum Amount"
              prefix="$"
            />
            <RangeFilter
              label={"Date"}
              minName="minDate"
              maxName="maxDate"
              minValue={minDate}
              maxValue={maxDate}
              type="date"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 my-4">
            <SelectFilter
              label={"Status"}
              options={Object.keys(TransactionStatus)}
              name="transactionStatus"
              value={transactionStatus}
            />
            <SelectFilter
              label={"Type"}
              options={Object.keys(TransactionType)}
              name="transactionType"
              value={transactionType}
            />
          </div>
        </form>
        <p className="font-bold w-full border-b-2">Transactions</p>
        <div className="w-full h-[calc(100%-100px)] flex justify-center items-center py-6">
          <TransactionsTable transactions={data} />
        </div>
      </div>
    </div>
  );
}
