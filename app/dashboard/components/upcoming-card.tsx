import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const upcomingPayments = [
  {
    id: "pay001",
    date: "2025-10-02",
    description: "Rent - Apartment",
    category: "Housing",
    amount: 1200.0,
    status: "scheduled",
    account: "Checking ••••1234",
  },
  {
    id: "pay002",
    date: "2025-10-05",
    description: "Car Loan Payment",
    category: "Loans",
    amount: 325.5,
    status: "scheduled",
    account: "Checking ••••1234",
  },
  {
    id: "pay003",
    date: "2025-10-07",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    status: "scheduled",
    account: "Credit ••••5678",
  },
];

export function UpcomingCard() {
  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardAction>Manage Automated Payments</CardAction>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-4 my-2">
                <span className="col-span-2">Description</span>
                <span>Amount</span>
                <span>Date</span>
            </div>
          {upcomingPayments.map((payment) => (
            <div className="grid grid-cols-4 my-2" key={payment.id}>
                <span className="col-span-2">{payment.description}</span>
                <span>${payment.amount.toFixed(2).toLocaleString()}</span>
                <span>{new Date(payment.date).toLocaleDateString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
