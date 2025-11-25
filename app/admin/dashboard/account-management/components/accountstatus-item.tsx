"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AccountStatus } from "@prisma/client";
import { toast } from "sonner";

function AccountStatusItem({
  id,
  disabled,
  status, 
}: {
  id: string;
  disabled: boolean;
  status: AccountStatus;
}) {
  const handleSuspend = async () => {
    try {
      const res = await fetch("/api/account/suspend", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: id, accountStatus: status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Account Suspended!");

      // OPTIONAL: trigger refresh
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (err: any) {
      toast.error(err.message || "Error suspending account");
    }
  };

  return (
    <DropdownMenuItem disabled={disabled} onClick={handleSuspend}>
      {status === "ACTIVE" ? "Activate" : "Close"}
    </DropdownMenuItem>
  );
}

export default AccountStatusItem;
