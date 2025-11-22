import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Transaction } from "@prisma/client";
import { Check, CircleDashed, EllipsisVertical } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { RequestCancelTransactionItem } from "./cancel-item";
import { redirect } from "next/navigation";
import { X } from "lucide-react"

export async function TransactionTableCard({
  transactions = [],
  activeAccountId,
  userId,
}: {
  transactions?: Transaction[];
  activeAccountId: string;
  userId: string;
}) {
  const user = await prisma.customer.findUnique({
    where: {
      auth0_user_id: userId,
    },
  });

  if (!user) {
    redirect("/");
  }

  function renderStatus(status: string) {
    switch (status) {
      case "PENDING":
        return <span className="text-yellow-500"><CircleDashed /></span>;
      case "COMPLETED":
        return <span className="text-green-500"><Check /></span>;
      case "CANCELED":
        return <span className="text-red-500"><X /></span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  }

  return (
    <Card className="w-[80%]">
      <CardHeader>
        <CardTitle>View Your Transactions</CardTitle>
        <CardDescription>Transactions</CardDescription>
      </CardHeader>

      <CardContent>
        <Table className="text-md">
          <TableHeader>
            <TableRow>
              <TableHead>Sent/Received</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: Transaction) => {
              // Determine if this transaction was sent or received
              const sent = transaction.account_id === activeAccountId;

              return (
                <TableRow key={transaction.transaction_id}>
                  <TableCell>{sent ? "Sent" : "Received"}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>{transaction.description || "-"}</TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{renderStatus(transaction.transaction_status)}</TableCell>
                  <TableCell>
                    $
                    {Math.abs(Number(transaction.amount))
                      .toFixed(2)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell className="hover:cursor-pointer">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="hover:cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          Manage Transaction
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <RequestCancelTransactionItem
                          id={transaction.transaction_id}
                          disabled={
                            transaction.transaction_status === "CANCELED"
                          }
                          user={user}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
