"use client";

import { type Transaction, TransactionType } from "@prisma/client";
import { Check, CircleDashed, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_AVATAR = "https://avatar.vercel.sh/";

export function TransactionCard({
  transactions = [],
  activeAccountId,
}: {
  transactions?: Transaction[];
  activeAccountId: string;
}) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const amountClass = (tx: Transaction) => {
    if (tx.transaction_type === TransactionType.TRANSFER) {
      if (tx.account_id === activeAccountId) {
        return "text-red-600 font-medium";
      }
      if (tx.account_id2 === activeAccountId) {
        return "text-green-600 font-medium";
      }
    }

    if (tx.transaction_type === TransactionType.DEPOSIT) {
      return "text-green-600 font-medium";
    }

    if (tx.transaction_type === TransactionType.WITHDRAWAL) {
      return "text-red-600 font-medium";
    }

    // fallback
    return Number(tx.amount) >= 0
      ? "text-green-600 font-medium"
      : "text-red-600 font-medium";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardAction>
          <Link href="/dashboard/transaction-history">View Transactions</Link>
        </CardAction>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">To</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction, idx) => (
              <TableRow key={idx}>
                <TableCell className="p-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={`${DEFAULT_AVATAR}/${transaction.description?.slice(-4)}`}
                    />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell className="font-medium truncate capitalize">
                  {transaction.description?.slice(0, 50 - 3) + "..." ||
                    "Unknown Transaction"}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {transaction.created_at.toLocaleDateString()}
                </TableCell>

                <TableCell className="flex justify-center text-sm mx-auto text-muted-foreground">
                  {transaction.transaction_status === "COMPLETED" ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : transaction.transaction_status === "PENDING" ? (
                    <CircleDashed className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <X className="w-6 h-6 text-red-600" />
                  )}
                </TableCell>

                <TableCell className={`text-right ${amountClass(transaction)}`}>
                  {formatter.format(Number(transaction.amount))}
                </TableCell>

                <TableCell className="text-right text-xs text-muted-foreground">
                  {transaction.transaction_type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
