"use client";
import { redirect } from "next/navigation";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleCurrentId } from "@/lib/user";

interface AccountSelectProps {
  accounts: Array<{
    account_id: string;
    account_type: string;
    account_limit?: number;
  }>;
  currentAccountId: string;
}

export function AccountSelect({
  accounts,
  currentAccountId,
}: AccountSelectProps) {
  const handleSelectedAccount = async (accountId: string) => {
    console.log("called");
    const active_id = await handleCurrentId(accountId);
    redirect("/dashboard");
  };

  return (
    <Select
      value={currentAccountId}
      onValueChange={(value) => handleSelectedAccount(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentAccountId} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {accounts.map((account) => (
            <SelectItem key={account.account_id} value={account.account_id}>
              {account.account_type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
