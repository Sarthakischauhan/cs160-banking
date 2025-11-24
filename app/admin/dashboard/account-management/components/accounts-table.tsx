import { type Account, type Customer, Transaction } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { censorString, formatCurrency } from "@/lib/utils";

export type AccountWithExtraData = Account & {
  Customer: Customer;
  _count: {
    Transaction_Transaction_account_idToAccount: number;
  };
};

interface AccountsTableProps {
  accounts: AccountWithExtraData[];
}

export function AccountsTable(props: AccountsTableProps) {
  const decoder = new TextDecoder("utf-8");

  return (
    <div className="w-full h-fit border-2 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Account ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.accounts.map((account: AccountWithExtraData) => (
            <TableRow key={account.account_id}>
              <TableCell className="max-w-[120px]">
                {account.Customer.first_name?.toLocaleUpperCase()}
              </TableCell>
              <TableCell>
                {account.Customer.last_name?.toLocaleUpperCase()}
              </TableCell>
              <TableCell>{censorString(account.account_id)}</TableCell>
              <TableCell>{account.account_type}</TableCell>
              <TableCell>{formatCurrency(Number(account.balance))}</TableCell>
              <TableCell>
                {account._count.Transaction_Transaction_account_idToAccount}
              </TableCell>
              <TableCell>{account.created_at.toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Balance</DropdownMenuItem>
                    <DropdownMenuItem>Add Note</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Suspend</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
