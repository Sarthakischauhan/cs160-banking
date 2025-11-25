"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupportTableData } from "./supportticket-table";
import { TextCopy } from "@/components/ui/copy";

function ViewTicketDetailsItem({ ticket }: { ticket: SupportTableData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <DropdownMenuItem
        onClick={handleOpen}
        onSelect={(e) => e.preventDefault()}
      >
        View Details
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket {ticket.sticket_id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-md">
            <p>
              <strong>Status:</strong> {ticket.ticket_status}
            </p>
            <p>
              <strong>Type:</strong> {ticket.ticket_type}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </p>
            {ticket.Customer && (
              <p>
                <strong>Customer:</strong> {ticket.Customer.first_name}{" "}
                {ticket.Customer.last_name}
              </p>
            )}
            {ticket.Handler && (
              <p>
                <strong>Handler:</strong> {ticket.Handler.first_name}{" "}
                {ticket.Handler.last_name}
              </p>
            )}
            {ticket.message && (
              <p>
                <strong>Description:</strong> {ticket.message}
              </p>
            )}
            {ticket.transaction_id && (
              <div className="flex gap-4 items-center">
                <strong>Transaction ID:</strong> {ticket.transaction_id}{" "}
                <TextCopy text={ticket.transaction_id} />
              </div>
            )}
            {ticket.account_id && (
              <div className="flex gap-4 items-center">
                <strong>Account ID:</strong> {ticket.account_id}{" "}
                <TextCopy text={ticket.account_id} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ViewTicketDetailsItem;
