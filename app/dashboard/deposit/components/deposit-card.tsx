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

export function DepositCard() {
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const router = useRouter()



  return (
    <>
      <Card className="w-[50%]">
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
          <CardDescription>Transfer funds into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {router.push("/dashboard")})}className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-4xl">$</span>
                        <MoneyInput field={field}/>
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
              <Button type="submit" variant="success">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
