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

import {
  Account,
  Customer,
  Transaction,
  TransactionStatus,
} from "@prisma/client";
import { CheckCircle2, XCircle, Clock3, Ban, Loader2 } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { censorString, formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionDetailsButton } from "./transaction-details";
import { CancelTransactionItem } from "./cancel-transaction";
import { ApproveTransactionItem } from "./approve-transaction";

export function TransactionsTable(transactions: {
  transactions: Record<string, any>;
}) {
  function statusIcon(status: TransactionStatus) {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;

      case "PENDING":
        return <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />;

      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-600" />;

      case "CANCELED":
        return <Ban className="h-5 w-5 text-gray-500" />;

      case "SCHEDULED":
        return <Clock3 className="h-5 w-5 text-blue-500" />;

      default:
        return null;
    }
  }
  return (
    <div className="w-full h-fit border-2 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>New Balance</TableHead>
            <TableHead>Time</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.transactions.data.map(
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
                  {statusIcon(transaction.transaction_status)}
                </TableCell>
                <TableCell>
                  {transaction.created_at.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {transaction.Account.Customer.first_name +
                    " " +
                    transaction.Account.Customer.last_name}
                </TableCell>
                <TableCell>
                  {transaction.Account_Transaction_account_id2ToAccount.Customer
                    ? transaction.Account_Transaction_account_id2ToAccount
                        .Customer &&
                      transaction.Account_Transaction_account_id2ToAccount
                        .Customer.first_name +
                        " " +
                        transaction.Account_Transaction_account_id2ToAccount
                          .Customer.last_name
                    : "N/A"}
                </TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
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
                  {transaction.created_at.toLocaleTimeString()}
                </TableCell>
                <TableCell className="hover:cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Manage Transaction</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <TransactionDetailsButton transaction={transaction} />
                      <ApproveTransactionItem
                        disabled={["COMPLETED"].includes(
                          transaction.transaction_status
                        )}
                        id={transaction.transaction_id}
                      />
                      <DropdownMenuSeparator />
                      <CancelTransactionItem
                        disabled={["CANCELED"].includes(
                          transaction.transaction_status
                        )}
                        id={transaction.transaction_id}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
