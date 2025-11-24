"use client";

import { toast } from "sonner"; // or your toast lib
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function CancelTransactionItem({ id }: { id: string }) {
  const handleCancel = async () => {
    try {
      const res = await fetch("/api/transactions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Transaction cancelled!");
      // OPTIONAL: trigger refresh
      window.location.reload(); // replace with cache revalidate if SSR
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel transaction");
    }
  };

  return <DropdownMenuItem onClick={handleCancel}>Cancel</DropdownMenuItem>;
}
