"use client";

import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CancelTransactionItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [open, setOpen] = useState(false);

  const handleCancel = async () => {
    try {
      const res = await fetch("/api/transactions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const notif = await fetch("/api/notifications/update-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id, updateType: "CANCEL" }),
      });

      const notification = await notif.json();
      if (!notif.ok) throw new Error(notification.message);

      toast.success("Transaction cancelled!");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={disabled}>Cancel</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Cancellation</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to cancel this transaction? This action cannot be undone.</p>
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
