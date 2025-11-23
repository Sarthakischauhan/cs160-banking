import { prisma } from "@/prisma/prisma";
import { AccountsTable } from "./components/accounts-table";
import { Button } from "@/components/ui/button";
import {
  PaginationControls,
  RangeFilter,
  SelectFilter,
  TextFilter,
} from "../components/filters";
import { AccountType } from "@prisma/client";
import { getAccounts } from "@/lib/admin/adminData";
import { get } from "http";

export default async function AccountManagementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams;

  const pageSize = 20;
  const {
    id="",
    firstName = "",
    lastName = "",
    minBalance = "",
    maxBalance = "",
    minDate = "",
    maxDate = "",
    accountType = "",
    cursor = undefined,
  } = params;

  const accountData = await getAccounts(params, cursor, pageSize);
  const nextCursor =
    accountData.accounts.length >= pageSize
      ? accountData.accounts[accountData.accounts.length - 1].account_id
      : null;

  console.log(accountData);

  return (
    <>
      <div className="w-full h-fit">
        <div className="p-10">
          <h1 className="text-4xl font-bold mb-10">Account Management</h1>
          <form method="GET" className="flex flex-col gap-4">
            <p className="font-bold w-full border-b-2">Filters</p>
            <div className="grid grid-cols-4 w-full gap-4">
              <TextFilter
                label={"ID"}
                name="id"
                value={id}
                placeholder="Enter Account ID"
              />
              <TextFilter
                label={"First Name"}
                name="firstName"
                value={firstName}
                placeholder="First Name"
              />
              <TextFilter
                label={"Last Name"}
                name="lastName"
                value={lastName}
                placeholder="Last Name"
              />
            </div>
            <div className="grid grid-cols-3 w-full gap-4">
              <SelectFilter
                  label="Account Type"
                  name="accountType"
                  options={Object.keys(AccountType)}
                  value={accountType}
                />
                <RangeFilter
                  label={"Balance"}
                  minName="minBalance"
                  maxName="maxBalance"
                  minValue={minBalance}
                  maxValue={maxBalance}
                  minPlaceholder="Minimum Balance"
                  maxPlaceholder="Maximum Balance"
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

          <div className="w-full h-[calc(100%-100px)] flex flex-col items-center py-6 gap-4">
            <p className="font-bold w-full border-b-2">Accounts</p>
            <AccountsTable accounts={accountData.accounts} />
          </div>
          <div className="w-full flex justify-center items-center">
            <PaginationControls nextCursor={nextCursor} />
          </div>
        </div>
      </div>
    </>
  );
}
