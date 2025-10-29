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
import {
  metricslist,
  pendingTransfers,
  supportTickets,
  trendsData1,
} from "./dummydata/data";
import { getAccountsSummary, getCustomerSummary, getTransactionSummary } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [account, customer, transaction] = await Promise.all([
    getAccountsSummary(),
    getCustomerSummary(),
    getTransactionSummary()
  ]);
  const data = { account: account, customer: customer, transaction: transaction };

  const metricsList: MetricCardProps[] = [
    {
        title: "Total Accounts",
        value: account.count
    },
    {
        title: "Overall Balance",
        value: formatCurrency(Number(account.totalBalance))
    },
    {
        title: "Total Transactions",
        value: transaction.count
    }
  ]

  console.log(data)
  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold">Welcome, Administrator!</h1>
      </div>
      <div className="px-10 py-5 w-full">
        <h1 className="text-4xl font-bold">Metrics</h1>
      </div>

      <div className="w-full max-w-[90%] mx-auto px-4">
        <Carousel className="relative w-full">
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
        <TrendsCard title={trendsData1.title} data={trendsData1.data} />
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
        <TableCard
          title="Pending Transfers"
          description="See pending transfers requiring your attention"
          data={pendingTransfers}
          disable={["id"]}
        />
      </div>
    </div>
  );
}
