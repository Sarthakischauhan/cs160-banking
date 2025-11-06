"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { MoneyInput } from "../../deposit/components/money-input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Transfer = {
  account_id: string | null;
  account_id2: string | null;
  amount: number | null;
  balance: number | null;
  transaction_type: "immediate" | "scheduled";
  description: string | null;
};

let test = ""; 
let test2 = ""; 


export function TransferCard({
  selectedRecipient,
  activeAccountId,
}: {
  selectedRecipient?: string | null;
  activeAccountId?: string;
}) {
    
  const router = useRouter();
  const [accountId, setAccountId] = useState<Transfer | null>(null);

  const form = useForm<Transfer>({
    defaultValues: {
      account_id: null,
      account_id2: selectedRecipient ?? null,
      amount: null,
      transaction_type: "immediate",
      description: null,
    },
  });

  // activeAccountId is provided from the server page; fall back to fetched account if not present
  useEffect(() => {
    if (!activeAccountId) return;
    // keep accountId state minimal for compatibility
    setAccountId({
      account_id: activeAccountId,
      account_id2: null,
      amount: null,
      balance: null,
      transaction_type: "immediate",
      description: null,
    });
  }, [activeAccountId]);

  const handleClick = async (values: any) => {
    const fromAccount = activeAccountId ?? accountId?.account_id;
    if (!fromAccount) return;

    const payload = {
      from_account_id: fromAccount,
      to_account_id: values.account_id2,
      amount: Number(values.amount),
      description: values.description,
    };

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // minimal error handling: log and return
      console.error("Transfer failed", await res.text());
      return;
    }

    router.push("/dashboard"); // Return to dashboard
  };

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Transfer</CardTitle>
        <CardDescription>Transfer funds securely and quickly</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleClick)} className="space-y-6">
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-4xl">
                        $
                      </span>
                      <MoneyInput field={field} />
                    </div>
                  </FormControl>
                  <FormDescription>Amount to Transfer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipient */}
            <FormField
              control={form.control}
              name="account_id2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Account</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Recipient Account ID or Email"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the recipient’s account ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transfer Type */}
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Type</FormLabel>
                  <FormControl>
                    <select
                      className="border rounded-md p-2 w-full"
                      {...field}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </FormControl>
                  <FormDescription>Select transfer type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this transfer for?"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Optional memo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" variant="success" disabled={!accountId}>
              {accountId ? "Send" : "Loading..."}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
