"use client"

import { TextCopy } from '@/components/ui/copy'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/lib/utils'
import { Account, Customer } from '@prisma/client'
import React from 'react'
import { AccountWithExtraData } from './accounts-table'

function AccountDetailsItem({account}: {account: any}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // ⬅️ Prevent dropdown closing
        >
          View Details
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p>
              <strong>ID:</strong> {account.account_id}
            </p>
            <TextCopy text={account.account_id} />
          </div>
          <p>
            <strong>From:</strong>{" "}
            {account.Customer.first_name +
              " " +
              account.Customer.last_name}
          </p>
          <p>
            <strong>Type:</strong> {account.account_type}
          </p>
          <p>
            <strong>Balance:</strong> {formatCurrency(Number(account.balance))}
          </p>
          <p></p>
          <p>
            <strong>Status:</strong> {account.account_status}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(account.created_at).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountDetailsItem
