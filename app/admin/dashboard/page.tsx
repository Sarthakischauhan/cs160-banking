import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MetricCard, MetricCardProps } from "./components/metric-card";
import { TableCard } from "./components/table-card";
import { TrendsCard } from "./components/trends-card";
import { pendingTransfers, supportTickets } from "./dummydata/data";
import {
  getAccountsSummary,
  getCustomerSummary,
  getTransactionSummary,
} from "@/lib/adminData";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const start = new Date();
  const end = new Date();
  const timePeriod = 30;

  start.setDate(end.getDate() - timePeriod);

  const [account, customer, transaction] = await Promise.all([
    getAccountsSummary("month"),
    getCustomerSummary(),
    getTransactionSummary("month"),
  ]);
  const data = {
    account: account,
    customer: customer,
    transaction: transaction,
  };

  const metricsList: MetricCardProps[] = [
    {
      title: "Overall Bank Assets",
      value: formatCurrency(Number(account.totalBalance)),
    },
    {
      title: "Total Accounts",
      value: account.count,
    },
    {
      title: "Total Transactions",
      value: transaction.count,
    },
    {
      title: "Pending Transactions",
      value: 2,
    },
    {
      title: "Unread Notifications",
      value: 4,
    },
  ];

  console.log(data);
  return (
    <div className="w-full h-fit">
      <div className="p-10 grid grid-cols-2">
        <h1 className="text-4xl font-bold">Welcome, Administrator!</h1>
        <div className="w-full flex justify-end">
          <Button className="w-[200] hover:cursor-pointer">
            <a
              href="/dashboard"
              className="bg-black text-white rounded-lg text-center py-2 hover:bg-opacity-80"
            >
              View User Dashboard
            </a>
          </Button>
        </div>
      </div>
      <div className="px-10 py-5 w-full">
        <h1 className="text-4xl font-bold">Metrics</h1>
      </div>

      <div className="w-full max-w-[90%] mx-auto px-4">
        <Carousel opts={{ loop: true }} className="relative w-full">
          <CarouselPrevious />
          <CarouselContent>
            {metricsList.map((metric, key) => {
              return (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={key}>
                  <MetricCard key={key} {...metric} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
      <div className="w-full h-fit p-2 justify-center items-center">
        <TrendsCard
          title="This Month's Trends"
          trendData={{
            balance: account.balanceHistory,
            transactions: transaction.transactionHistory,
          }}
        />
      </div>
      <div className="px-10 py-5 w-full">
        <h1 className="text-4xl font-bold">Pending</h1>
      </div>
      <div className="grid grid-cols-2 w-full h-fit p-2 justify-center items-center gap-4">
        <TableCard
          title="Pending Support Tickets"
          description="See recent support tickets from users"
          data={supportTickets}
          disable={["ticketId"]}
        />
        {transaction.pendingTransactions.length > 0 ? (
          <TableCard
            title="Pending Transfers"
            description="See pending transfers requiring your attention"
            data={transaction.pendingTransactions}
            disable={["id"]}
          />
        ) : (
          <Card className="flex h-full ">
            <CardHeader>
              <CardTitle>Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-full">
              No Pending Transactions
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
