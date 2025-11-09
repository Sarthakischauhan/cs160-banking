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
import Decimal from "decimal.js";
import type { AccountType } from "@prisma/client";

type DepositCardProps = {
  account_id: string
}

export function DepositCard({account_id} : DepositCardProps) {

  const router = useRouter() // Allows us to navigate back to dashboard
  
  const form = useForm({ // Initalize the structre with placeholder values 
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const handleClick = async (values: any) =>{ 
     // When submit button is clicked api for deposit will hit
     const payload = {
      amount: values.amount,
      account_id: account_id,
      description: values.description
     }
    
     const response = await fetch("/api/deposit",{
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
     })

     if(!response.ok){
      return new Error("Couldn't deposit money")
     }

     router.push("/dashboard")
  };

  return (
    <>
      <Card className="w-2/3">
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
