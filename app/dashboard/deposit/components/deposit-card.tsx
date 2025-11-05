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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MoneyInput } from "./money-input";
import { useEffect, useState } from "react";

type Customer = {  // Structure to hold customer info from the UI input
  customer_id: string | null;
  balance: number | null;
};

let test = ""; // Placeholder to store the first account info

export function DepositCard() {
  const router = useRouter() // Allows us to navigate back to dashboard
  const [customer, setAccount] = useState<Customer | null>(null); // define customer with the Customer structure
  
  const form = useForm({ // Initalize the structre with placeholder values 
    defaultValues: {
      amount: "",
      description: "",
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
      setAccount(firstAccount); //retrieve the first account info will need to modify later to allow picking of multiple accounts
   
      if (!firstAccount.account_id) {
        console.error("No account_id found!");
        return;
      }

      test = firstAccount.account_id; //Just to retain value
    }

    fetchProfile();      
  }, []);

  const handleClick = async (values: any) =>{  // When submit button is clicked api for deposit will hit
    if (!customer?.customer_id) return;
      const res = await fetch("/api/deposit", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ // Will give api deposit these values to allow it to work
      account_id : test,
      amount: Number(values.amount),
      description: values.description, 
    }),
  });
    router.push("/dashboard"); // Return to dashboard
};

  return (
    <>
      <Card className="w-[50%]">
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
          <CardDescription>Transfer funds into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleClick)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MoneyInput field={field} />
                      </div>
                    </FormControl>
                    <FormDescription>Amount to deposit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What's this deposit for?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Memo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Button>Use Check</Button>
                <span className="text-sm">Upload a Check</span>
              </div>
              <div className="">
                <Button type="submit" variant="success">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
