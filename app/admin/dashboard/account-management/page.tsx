import { prisma } from "@/prisma/prisma";
import { AccountsTable } from "./components/accounts-table";
import { Button } from "@/components/ui/button";
import { RangeFilter, SelectFilter, TextFilter } from "../components/filters";
import { AccountType } from "@prisma/client";

export default async function AccountManagementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams
  const firstName = params.firstName ?? "";
  const lastName = params.lastName ?? "";
  const minBalance = params.minBalance ?? "";
  const maxBalance = params.maxBalance ?? "";
  const minDate = params.minDate ?? "";
  const maxDate = params.maxDate ?? "";
  const accountType = params.accountType ?? "";

  const accountData = await prisma.account.findMany({
    where: {
      ...(accountType ? { account_type: accountType as AccountType } : {}),
      ...(firstName
        ? {
            Customer: {
              first_name: {
                contains: firstName,
                mode: "insensitive"
              }
            },
          }
        : {}),
      ...(lastName
        ? {
            Customer: {
              last_name: {
                contains: lastName,
                mode: "insensitive"
              }
            },
          }
        : {}),
      ...(minBalance || maxBalance
        ? {
            balance: {
              gte: minBalance ? Number(minBalance) : undefined,
              lte: maxBalance ? Number(maxBalance) : undefined,
            },
          }
        : {}),
      ...(minDate || maxDate
        ? {
            created_at: {
              gte: minDate ? new Date(minDate) : undefined,
              lte: maxDate ? new Date(maxDate) : undefined,
            },
          }
        : {}),
    },
    include: {
      Customer: true,
      _count: {
        select: { Transaction_Transaction_account_idToAccount: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  console.log(accountData);

  return (
    <>
      <div className="w-full h-fit">
        <div className="p-10">
          <h1 className="text-4xl font-bold mb-10">Account Management</h1>
          <form method="GET" className="flex flex-col gap-4">
            <p className="font-bold w-full border-b-2">Filters</p>
            <div className="flex gap-4">
              <Button type="submit">Apply Filters</Button>
            </div>
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
            <AccountsTable accounts={accountData} />
          </div>
        </div>
      </div>
    </>
  );
}
