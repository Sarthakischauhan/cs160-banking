import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Account } from "@prisma/client"

interface AccountSelectProps{
  accountNames: Account[];
}

export async function AccountSelect({accountNames}:AccountSelectProps) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={accountNames[0].account_id} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {accountNames.map((account, key) => (
            <SelectItem key={key} value={account.account_id}>{account.account_id}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
