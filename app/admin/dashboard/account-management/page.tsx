import { prisma } from "@/prisma/prisma";
import { AccountsTable } from "./components/accounts-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatCurrency } from "@/lib/utils";

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
            <div>
              <Label className="mr-2">Search:</Label>
              <Input
                type="text"
                placeholder="Search by ID"
                className="w-full"
              />
            </div>
            <div>
              <Label className="mr-2">Date Created:</Label>
              <Input name="dateFrom" type="date" className="w-3/7 mr-2" />
              <span>-</span>
              <Input name="dateTo" type="date" className="w-3/7 ml-2" />
            </div>
            <div>
              <Label className="mr-2">Balance Range:</Label>
              <div className="flex flex-row items-center">
                <InputGroup className="w-3/7 mr-2">
                  <InputGroupAddon>$</InputGroupAddon>
                  <InputGroupInput placeholder="Min Balance"></InputGroupInput>
                </InputGroup>
                <span>-</span>
                <InputGroup className="w-3/7 mr-2">
                  <InputGroupAddon>$</InputGroupAddon>
                  <InputGroupInput placeholder="Min Balance"></InputGroupInput>
                </InputGroup>
              </div>
            </div>
            <div>
              <div>
                <Label className="mr-2">Search Name:</Label>
                <div className="flex flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="w-1/2"
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="w-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <Button>Apply Filters</Button>
          </div>
        </div>
        <div className="w-full h-[calc(100%-100px)] flex justify-center px-10 py-5">
          <AccountsTable accounts={accountData} />
        </div>
      </div>
    </>
  );
}
