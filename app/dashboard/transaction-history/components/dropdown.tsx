"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { RequestApprovalTransactionItem } from "./approve-item";
import { RequestCancelTransactionItem } from "./cancel-item";
import { Transaction, TransactionStatus } from "@prisma/client";

export default function TransactionManagementDropdown({
  transaction_id,
  transaction_status,
  user,
}: {
  transaction_id: string;
  transaction_status: TransactionStatus
  user: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="hover:cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage Transaction</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <RequestApprovalTransactionItem
          id={transaction_id}
          disabled={transaction_status === "COMPLETED"}
          first_name={user.first_name}
          last_name={user.last_name}
        />
        <RequestCancelTransactionItem
          id={transaction_id}
          disabled={transaction_status === "CANCELED"}
          first_name={user.first_name}
          last_name={user.last_name}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
