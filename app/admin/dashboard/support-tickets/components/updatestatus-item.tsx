"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TicketStatus } from "@prisma/client";
import { toast } from "sonner";

function UpdateStatusItem({
  id,
  disabled,
  status,
}: {
  id: string;
  disabled: boolean;
  status: TicketStatus;
}) {
  const handleMark = async () => {
    try {
      const res = await fetch("/api/support/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sticket_id: id, newStatus: status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Status Updated!");

      // OPTIONAL: trigger refresh
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve transaction");
    }
  };

  return (
    <DropdownMenuItem disabled={disabled} onClick={handleMark}>
      {`Mark as ${status.toLowerCase()}`}
    </DropdownMenuItem>
  );
}

export default UpdateStatusItem;
