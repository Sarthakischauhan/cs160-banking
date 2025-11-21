"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // or your toast lib

export function ApproveTransactionItem({ id, disabled}: { id: string, disabled: boolean }) {
  const handleApprove = async () => {
    try {
      const res = await fetch("/api/transactions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Transaction approved!");

      const notif = await fetch("/api/notifications/update-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ transaction_id: id, updateType: "APPROVE"})
      })
      const notification = await notif.json()
      if (!notif.ok) throw new Error(notification.message)
        
      // OPTIONAL: trigger refresh
      window.location.reload(); // replace with cache revalidate if SSR
    } catch (err: any) {
      toast.error(err.message || "Failed to approve transaction");
    }
  };

  return (
    <DropdownMenuItem disabled={disabled} onClick={handleApprove}>
      Approve
    </DropdownMenuItem>
  );
}