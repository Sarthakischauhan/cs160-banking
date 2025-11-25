import {
  TextFilter,
  RangeFilter,
  SelectFilter,
  PaginationControls,
} from "../components/filters";
import { TransactionsTable } from "./components/transactions-table";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { getTransactions } from "@/lib/admin/adminData";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams;
  const pageSize = 20;
  const {
    id = "",
    firstName = "",
    lastName = "",
    minAmount = "",
    maxAmount = "",
    minDate = "",
    maxDate = "",
    transactionStatus = "",
    transactionType = "",
    cursor = undefined,
  } = params;

  const data = await getTransactions(params, cursor, pageSize);

  // Determine the next cursor (last item's ID)
  const transactions = data.data;
  const nextCursor =
    transactions.length >= pageSize
      ? transactions[transactions.length - 1].transaction_id
      : null;

  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Transactions</h1>
        <form method="GET" className="flex flex-col gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div className="w-full grid sm:grid-cols-1 md:grid-cols-4 gap-4 py-4">
            <TextFilter label={"Transaction ID"} name="id" value={id} />
            <TextFilter
              label={"First Name"}
              name="firstName"
              value={firstName}
            />
            <TextFilter label={"Last Name"} name="lastName" value={lastName} />
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-4">
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
            <RangeFilter
              label={"Amount"}
              minName="minAmount"
              maxName="maxAmount"
              minValue={minAmount}
              maxValue={maxAmount}
              minPlaceholder="Minimum Amount"
              maxPlaceholder="Maximum Amount"
              type="number"
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
        </form>
        <p className="font-bold w-full border-b-2">Transactions</p>
        <div className="w-full h-[calc(100%-100px)] flex justify-center items-center py-6">
          <TransactionsTable transactions={data} />
        </div>
        <div className="w-full flex justify-center items-center">
          <PaginationControls nextCursor={nextCursor} />
        </div>
      </div>
    </div>
  );
}
