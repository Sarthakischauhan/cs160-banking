import { AccountType } from "@prisma/client";
import { get } from "http";
import { Button } from "@/components/ui/button";
import { getAccounts } from "@/lib/adminData";
import { prisma } from "@/prisma/prisma";
import {
  PaginationControls,
  RangeFilter,
  SelectFilter,
  TextFilter,
} from "../components/filters";
import { AccountsTable } from "./components/accounts-table";

type searchParamsType = Promise<{ [key: string]: string | undefined }>;

export default async function AccountManagementPage({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const params = await searchParams;

  const pageSize = 20;
  const {
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
  const nextCursor = accountData.accounts.length
    ? accountData.accounts[accountData.accounts.length - 1].account_id
    : null;

  return (
    <>
      <div className="w-full h-fit">
        <div className="p-10">
          <h1 className="text-4xl font-bold mb-10">Account Management</h1>
          <form method="GET" className="flex flex-col gap-4">
            <p className="font-bold w-full border-b-2">Filters</p>
            <div className="grid grid-cols-4 w-full gap-4">
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
            <div className="grid grid-cols-3 w-full gap-4">
              <div>
                <SelectFilter
                  label="Account Type"
                  name="accountType"
                  options={Object.keys(AccountType)}
                  value={accountType}
                />
              </div>
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
