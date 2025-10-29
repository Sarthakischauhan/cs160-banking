import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account, Customer, Transaction } from "@prisma/client";
import { EllipsisVertical } from "lucide-react";

export type AccountWithExtraData = Account & {
  Customer: Customer;
  _count: {
    Transaction: number;
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
            <TableHead>Customer ID</TableHead>
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
              <TableCell className="text-wrap">{account.Customer.customer_id}</TableCell>
              <TableCell className="text-wrap">{account.account_id}</TableCell>
              <TableCell>{account.account_type ? decoder.decode(account.account_type) : ""}</TableCell>
              <TableCell>
                ${account.balance.toFixed(2).toLocaleString()}
              </TableCell>
              <TableCell>{account._count.Transaction}</TableCell>
              <TableCell>{account.created_at.toLocaleDateString()}</TableCell>
              <TableCell className="hover:cursor-pointer"><EllipsisVertical /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
