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
import { useEffect } from "react";

export function TransferCard({selectedRecipient}: {selectedRecipient?: string | null}) {
  const form = useForm({
    defaultValues: {
      amount: "",
      send_to: "",
      type: "immediate",
      description: "",
      date: Date.now(),
    },
  });

  useEffect(() => {
    if (selectedRecipient) {
      form.setValue("send_to", selectedRecipient);
    }
  }, [selectedRecipient, form])

  const router = useRouter();

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader>
          <CardTitle>Transfer</CardTitle>
          <CardDescription>Transfer funds securely and quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {
                router.push("/dashboard");
              })}
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
              <div className="grid grid-cols-2 gap-10">
                <FormField
                  control={form.control}
                  name="send_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter Email/Phone Number/User ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="What's this for?" {...field} />
                    </FormControl>
                    <FormDescription>Memo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="success">
                Send
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
