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
  type: "immediate" | "scheduled";
  description: string | null;
};

export function TransferCard({
  selectedRecipient,
}: {
  selectedRecipient?: string | null;
}) {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>(null);

  const form = useForm<Transfer>({
    defaultValues: {
      account_id: null,
      account_id2: selectedRecipient ?? null,
      amount: null,
      type: "immediate",
      description: null,
    },
  });

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }

        await res.json(); // we don’t actually use the transactions result

        // Fetch the user’s account
        const res2 = await fetch("/api/account");
        if (res2.status === 401) {
          window.location.href = "/auth/login";
          return;
        }

        const data2 = await res2.json();
        const firstAccount = data2[0];

        if (!firstAccount?.account_id) {
          console.error("No account_id found!");
          return;
        }

        // Set the user’s account ID
        setAccountId(firstAccount.account_id);
        form.setValue("account_id", firstAccount.account_id);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }

    fetchTransactions();

    if (selectedRecipient) {
      form.setValue("account_id2", selectedRecipient);
    }
  }, [selectedRecipient, form]);

  const onSubmit = async (values: Transfer) => {
    if (!accountId) {
      console.error("Account not ready yet");
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      console.error("Transfer failed:", await res.text());
    }
  };

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Transfer</CardTitle>
        <CardDescription>Transfer funds securely and quickly</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="type"
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
