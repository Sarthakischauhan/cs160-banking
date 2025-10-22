import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";

type Transaction = {
  transaction_id: string;
  account_id: string;
  customer_id: string;
  amount: number;
  amount_after_transaction: number;
  transaction_status: string;
  transaction_type: string;
  created_at: Date;
};

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable(props: TransactionsTableProps) {

  return (
    <div className="w-full h-fit border-2 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Account ID</TableHead>
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
              <TableCell className="text-wrap">
                {transaction.transaction_id}
              </TableCell>
              <TableCell className="text-wrap">
                {transaction.account_id}
              </TableCell>
              <TableCell>{transaction.transaction_type}</TableCell>
              <TableCell>{transaction.transaction_status}</TableCell>
              <TableCell>
                ${transaction.amount.toFixed(2).toLocaleString()}
              </TableCell>
              <TableCell>
                $
                {transaction.amount_after_transaction
                  .toFixed(2)
                  .toLocaleString()}
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
