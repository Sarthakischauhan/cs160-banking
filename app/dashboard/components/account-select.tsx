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

const accountNames = [
    "Account 1",
    "Account 2",
    "Account 3"
]

export function AccountSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={accountNames[0]} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Accounts</SelectLabel>
          {accountNames.map((account) => (
            <SelectItem key={account} value={account}>{account}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
