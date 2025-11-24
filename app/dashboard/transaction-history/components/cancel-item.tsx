"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth0 } from "@/lib/auth0";
import { Customer } from "@prisma/client";
import { getUserData } from "@/lib/user";

export function RequestCancelTransactionItem({
  id,
  disabled,
  user,
}: {
  id: string;
  disabled: boolean;
  user: Customer;
}) {
  const [open, setOpen] = useState(false);
  const message = `${user.first_name} ${user.last_name} wants to cancel transaction ${id}: `;
  const subject = "Cancel Transaction";
  const ticketType = "CANCEL";

  const handleCancel = async () => {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject,
          message: message,
          transaction_id: id,
          ticketType: ticketType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Support ticket created!");
      setOpen(false);
    } catch (err: any) {
      setOpen(false);
      toast.error(err.message || "Failed to cancel transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => e.preventDefault()}
          disabled={disabled}
        >
          Request Cancellation
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Request</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to cancel this transaction?</p>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
