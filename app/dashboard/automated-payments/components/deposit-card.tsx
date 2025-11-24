"use client";

import type { AccountType } from "@prisma/client";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { MoneyInput } from "./money-input";

type DepositCardProps = {
  account_id: string;
};

export function DepositCard({ account_id }: DepositCardProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
      schedule_date: "",
    },
  });

  const handleClick = async (values: any) => {
    const payload = {
      amount: values.amount,
      account_id: account_id,
      description: values.description,
      scheduled: values.schedule_date, // match server API
    };

    const response = await fetch("/api/autopayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Deposit failed:", errorData.message);
      return new Error("Couldn't deposit money");
    }

    router.push("/dashboard");
  };

  return (
    <Card className="w-2/3">
      <CardHeader>
        <CardTitle>Automated Payments</CardTitle>
        <CardDescription>Schedule automated payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleClick)} className="space-y-6">
            {/* Amount Field */}
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
                  <FormDescription>Amount to schedule</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this scheduled payment for?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Memo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Date Field */}
            <FormField
              control={form.control}
              name="schedule_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the date to execute this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button type="submit" variant="success">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
