import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableHeader } from "@/components/ui/table";

const transactions = [
  {
    id: "tx001",
    date: "2025-09-29T14:30:00Z",
    description: "Starbucks - Coffee",
    category: "Food & Drink",
    amount: -5.75,
    account: "Checking ••••1234",
    balance: 1244.25,
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_9.png"
  },
  {
    id: "tx002",
    date: "2025-09-28T20:10:00Z",
    description: "Payroll Deposit",
    category: "Income",
    amount: 1850.00,
    account: "Checking ••••1234",
    balance: 1250.00,
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/teams_7.png"
  },
  {
    id: "tx003",
    date: "2025-09-27T17:45:00Z",
    description: "Amazon Purchase - Electronics",
    category: "Shopping",
    amount: -129.99,
    account: "Credit ••••5678",
    balance: 870.01,
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/notion_3.png"
  },
  {
    id: "tx004",
    date: "2025-09-26T12:15:00Z",
    description: "Safeway - Groceries",
    category: "Groceries",
    amount: -76.40,
    account: "Checking ••••1234",
    balance: 400.55,
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_21.png"
  },
];


export function TransactionCard() {
    return (
        <>
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardAction>View Transactions</CardAction>
            </CardHeader>
            <CardContent>
                {transactions.map((transaction) => (
                    <div className="grid grid-cols-5 justify-center items-center my-2" key={transaction.id}>
                        <Avatar className="h-13 w-13">
                            <AvatarImage src={transaction.img} />
                            <AvatarFallback>{transaction.id.substring(0,2)}</AvatarFallback> 
                        </Avatar>
                        <span className="text-sm col-span-2">{transaction.description}</span>
                        <span>${transaction.amount}</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
        </>
    )
}