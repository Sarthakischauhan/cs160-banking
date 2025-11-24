import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { censorString, formatCurrency } from "@/lib/utils";
import { Customer, SupportTicket, TicketStatus } from "@prisma/client";
import { EllipsisVertical, Squircle } from "lucide-react";
import { AccountWithExtraData } from "../../account-management/components/accounts-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateStatusItem from "./updatestatus-item";
import ViewTicketDetailItem from "./viewdetails-item";

export type SupportTableData = SupportTicket & {
  Customer: Customer;
  Handler: Customer | null;
};

function SupportTicketTable({ tickets }: { tickets: SupportTableData[] }) {
  function statusIcon(status: TicketStatus) {
    switch (status) {
      case "CLOSED":
        return (
          <div className="text-gray-400">
            <Squircle />
          </div>
        );
      case "OPEN":
        return <Squircle color="green" />;
      case "PENDING":
        return (
          <div className="text-yellow-500">
            <Squircle />
          </div>
        );
    }
  }

  return (
    <div className="w-full h-fit border-2 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Handler</TableHead>
            <TableHead>Type</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket: SupportTableData) => (
            <TableRow key={ticket.sticket_id}>
              <TableCell className="max-w-[120px]">
                {`SUP-${ticket.sticket_id.toString()}`}
              </TableCell>
              <TableCell>
                {`${ticket.Customer.first_name} ${ticket.Customer.last_name}`}
              </TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{statusIcon(ticket.ticket_status)}</TableCell>
              <TableCell>{ticket.Handler ? (`${ticket?.Handler?.first_name} ${ticket?.Handler?.last_name}`) : "N/A"}</TableCell>
              <TableCell>{ticket.ticket_type}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Manage Ticket</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ViewTicketDetailItem ticket={ticket} />
                    <DropdownMenuSeparator />
                    <UpdateStatusItem
                      id={ticket.sticket_id.toString()}
                      disabled={ticket.ticket_status === "OPEN"}
                      status={"OPEN"}
                    />
                    <UpdateStatusItem
                      id={ticket.sticket_id.toString()}
                      disabled={ticket.ticket_status === "PENDING"}
                      status={"PENDING"}
                    />
                    <UpdateStatusItem
                      id={ticket.sticket_id.toString()}
                      disabled={ticket.ticket_status === "CLOSED"}
                      status={"CLOSED"}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SupportTicketTable;
