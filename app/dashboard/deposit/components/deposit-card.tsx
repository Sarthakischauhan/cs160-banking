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

type Customer = {
  customer_id: string | null;
  balance: number | null;
};

let test = "";

export function DepositCard() {
  const router = useRouter()
  const [customer, setAccount] = useState<Customer | null>(null);
  
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
    },
  });

<<<<<<< HEAD
    useEffect(() => {
      async function fetchProfile() {
        const res = await fetch("/api/account");
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
  
        const data = await res.json();
        const firstAccount = data[0];
        setAccount(firstAccount);
   
        if (!firstAccount.account_id) {
          console.error("No account_id found!");
          return;
        }

        test = firstAccount.account_id;
      }

      fetchProfile();      
    }, []);

   

    const handleClick = async (values: any) =>{  
    if (!customer?.customer_id) return;

    const res = await fetch("/api/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account_id : test,
      amount: Number(values.amount),
      description: values.description, 
    }),
  });
  const data = await res.json();
  console.log("Deposit response:", data.money);


  router.push("/dashboard"); 
};
=======
  const router = useRouter();
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2

  return (
    <>
      <Card className="w-[50%]">
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
          <CardDescription>Transfer funds into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
<<<<<<< HEAD
            <form onSubmit={form.handleSubmit(handleClick)}className="space-y-6">
=======
            <form
              onSubmit={form.handleSubmit(() => {
                router.push("/dashboard");
              })}
              className="space-y-6"
            >
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2
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
<<<<<<< HEAD
              <Button type="submit" variant="success" >
                Submit
              </Button>
=======
              <div className="flex flex-col items-center justify-center gap-2">
                <Button>Use Check</Button>
                <span className="text-sm">Upload a Check</span>
              </div>
              <div className="">
                <Button type="submit" variant="success">
                  Submit
                </Button>
              </div>
>>>>>>> e5531728a5498afe0d0be01fe75495667d5594e2
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
