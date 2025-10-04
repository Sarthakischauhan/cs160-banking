import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionTableCard(props: TransactionHistoryProps) {
  return (
    <>
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
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.transactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.amount < 0 ? "Sent" : "Received"}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${Math.abs(transaction.amount).toFixed(2).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
