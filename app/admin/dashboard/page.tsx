import { MetricCard, MetricCardProps } from "./components/metric-card";
import { TableCard } from "./components/table-card";
import { TrendsCard } from "./components/trends-card";
import {
  metricslist,
  pendingTransfers,
  supportTickets,
  trendsData1,
} from "./dummydata/data";

export default function AdminDashboardPage() {
  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold">Welcome, Administrator!</h1>
      </div>
      <div className="px-10 py-5 w-full">
        <h1 className="text-4xl font-bold">Metrics</h1>
      </div>

      <div className="w-full h-fit p-2 grid grid-cols-3 gap-4 justify-center items-center">
        {metricslist.map((metric, key) => {
          return <MetricCard key={key} {...metric} />;
        })}
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
