import { prisma } from "@/prisma/prisma";
import { AccountsTable } from "./components/accounts-table";
import { Button } from "@/components/ui/button";
import { FilterGroup, FilterInput, FilterRange } from "../components/filters";

export default async function AccountManagementPage() {
  const accountData = await prisma.account.findMany({
    include: {
      Customer: true,
      _count: {
        select: { Transaction: true },
      },
    },
  });
  console.log(accountData);

  return (
    <>
      <div className="w-full h-fit">
        <div className="p-10">
          <h1 className="text-4xl font-bold">Account Management</h1>
        </div>
        <div className="flex flex-col px-10 gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div className="grid grid-cols-3 w-full gap-4">
            <FilterInput
              inputProps={{
                label: "Search by ID",
                placeholder: "Enter ID",
                type: "text",
              }}
            />
            <FilterRange
              rangeProps={{
                label: "Balance Range",
                minPlaceholder: "Min Balance",
                maxPlaceholder: "Max Balance",
                type: "text",
                prefix: "$",
              }}
            />
            <FilterRange
              rangeProps={{
                label: "Date Created",
                minPlaceholder: "Start Date",
                maxPlaceholder: "End Date",
                type: "date",
              }}
            />
          </div>
          <div className="grid grid-cols-3 w-full gap-4">
            <div>
              <FilterGroup
                label="Search by Name: "
                inputFields={[
                  { id: "firstName", placeholder: "First Name" },
                  { id: "lastName", placeholder: "Last Name" },
                ]}
              />
            </div>
          </div>
          <div>
            <Button>Apply Filters</Button>
          </div>
        </div>

        <div className="w-full h-[calc(100%-100px)] flex flex-col items-center px-10 py-6 gap-4">
          <p className="font-bold w-full border-b-2">Accounts</p>
          <AccountsTable accounts={accountData} />
        </div>
      </div>
    </>
  );
}
