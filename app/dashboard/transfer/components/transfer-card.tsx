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
  selectedRecipient, }: {
  selectedRecipient?: string | null; }) {
    
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

   useEffect(() => { // Fetchs the api to get Account info 
      async function fetchProfile() {
        const res = await fetch("/api/account");
        if (res.status === 401) { // Ensures user is logged in correctly
          window.location.href = "/auth/login";
          return;
        }
    
        const data = await res.json();
        const firstAccount = data[0]; 
        setAccountId(firstAccount); //gets the first account ID
     
        if (!firstAccount.account_id) {
          console.error("No account_id found!");
          return;
        }

        test = firstAccount.account_id; //Just to retain value
        test2 = firstAccount.balance
  
      }
  
      fetchProfile();      
    }, []);
    
    const handleClick = async (values: any) =>{
      if (!accountId?.account_id) return;
      const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ // Will give api deposit these values to allow it to work
      account_id : test,
      account_id2: values.account_id2,
      amount: Number(values.amount),
      balance: test2,
      transaction_type: values.transaction_type,
      description: values.description, 
      }),
    });
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
