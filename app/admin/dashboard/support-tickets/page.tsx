import { TicketStatus, TicketType } from "@prisma/client";
import { RangeFilter, SelectFilter, TextFilter } from "../components/filters";
import { getSupportTickets } from "@/lib/admin/supportTickets";
import SupportTicketTable from "./components/supportticket-table";

async function AdminSupportTicketPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams;
  const pageSize = 20;
  const {
    firstName = "",
    lastName = "",
    minDate = "",
    maxDate = "",
    ticketStatus = "",
    ticketType = "",
    cursor = undefined,
  } = params;

  const tickets = await getSupportTickets(params, cursor, pageSize);
  console.log(tickets)

  return (
    <div className="w-full h-fit">
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-10">Transactions</h1>
        <form method="GET" className="flex flex-col gap-4">
          <p className="font-bold w-full border-b-2">Filters</p>
          <div className="w-full grid lg:grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1 py-4">
            <TextFilter
              label={"First Name"}
              name="firstName"
              value={firstName}
            />
            <TextFilter label={"Last Name"} name="lastName" value={lastName} />
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 my-4">
            <SelectFilter
              label={"Status"}
              options={Object.keys(TicketStatus)}
              name="ticketStatus"
              value={ticketStatus}
            />
            <SelectFilter
              label={"Type"}
              options={Object.keys(TicketType)}
              name="ticketType"
              value={ticketType}
            />
            <RangeFilter
              className="col-span-2"
              label={"Date"}
              minName="minDate"
              maxName="maxDate"
              minValue={minDate}
              maxValue={maxDate}
              type="date"
            />
          </div>
        </form>
        <p className="font-bold w-full border-b-2">Support Tickets</p>
        <div className="w-full h-[calc(100%-100px)] flex justify-center items-center py-6">
          {tickets ? (<SupportTicketTable tickets={tickets} />) : <p>No tickets to show. . .</p>}</div>
        <div className="w-full flex justify-center items-center"></div>
      </div>
    </div>
  );
}

export default AdminSupportTicketPage;
