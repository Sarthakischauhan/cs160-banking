"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { TicketType } from "@prisma/client";

interface AccountSettingsDropdownProps {
  accountId: string;
  user: any
}

export async function AccountSettingsDropdown({ accountId, user }: AccountSettingsDropdownProps) {
    const message = `${user.firstName} ${user.lastName} is requesting to suspend account ${accountId}`
    const subject = `Suspend Account`
    const ticketType: TicketType = "SUSPEND"
  const handleSuspend = async () => {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, message: message, subject: subject, ticketType: ticketType}),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Suspension Request Sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send suspension request");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings className="hover:cursor-pointer"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem variant="destructive" onClick={handleSuspend}>Suspend Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
