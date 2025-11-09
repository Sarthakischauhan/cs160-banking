"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";

import { Account, Customer, Transaction } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { censorString, formatCurrency } from "@/lib/utils";

export function TransactionsTable(transactions: {
  transactions: Record<string, any>;
}) {
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
          {transactions.transactions.map(
            (
              transaction: Transaction & {
                Account: Account & { Customer: Customer };
              } & {
                Account_Transaction_account_id2ToAccount: Account & {
                  Customer: Customer;
                };
              }
            ) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell>
                  {censorString(transaction.transaction_id)}
                </TableCell>
                <TableCell>
                  {transaction.Account.Customer.first_name +
                    " " +
                    transaction.Account.Customer.last_name}
                </TableCell>
                <TableCell>
                  {transaction.Account_Transaction_account_id2ToAccount.Customer
                    .first_name +
                    " " +
                    transaction.Account_Transaction_account_id2ToAccount
                      .Customer.last_name}
                </TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                <TableCell>{transaction.transaction_status}</TableCell>
                <TableCell>
                  {formatCurrency(Number(transaction.amount))}
                </TableCell>
                <TableCell>
                  {transaction.amount_after_transaction &&
                    formatCurrency(
                      Number(transaction.amount_after_transaction)
                    )}
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
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
