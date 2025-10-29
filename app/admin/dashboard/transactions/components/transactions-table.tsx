import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";

import { Transaction } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { censorString, formatCurrency } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export async function TransactionsTable(props: TransactionsTableProps) {

  return (
    <div className="w-full h-fit border-2 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>New Balance</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.transactions.map((transaction: Transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell>
                {censorString(transaction.transaction_id)}
              </TableCell>
              <TableCell>
                {censorString(transaction.account_id)}
              </TableCell>
              <TableCell>
                {transaction.account_id2 && censorString(transaction.account_id2)}
              </TableCell>
              <TableCell>{transaction.transaction_type}</TableCell>
              <TableCell>{transaction.transaction_status}</TableCell>
              <TableCell>
                {formatCurrency(Number(transaction.amount))}
              </TableCell>
              <TableCell>
                {transaction.amount_after_transaction && formatCurrency(Number(transaction.amount_after_transaction))}
              </TableCell>
              <TableCell>
                {transaction.created_at.toLocaleDateString()}
              </TableCell>
              <TableCell>
                {transaction.created_at.toLocaleTimeString()}
              </TableCell>
              <TableCell className="hover:cursor-pointer">
                <EllipsisVertical />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
