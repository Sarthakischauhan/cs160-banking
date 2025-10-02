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
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function DepositCard() {
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const router = useRouter()

  function formatCurrency(value?: string | number) {
    if (!value || value === "NaN" || value == 0) return "";
    const num = parseFloat(value.toString());
    return num.toFixed(2);
  }

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
                        <Input
                          placeholder="00.00"
                          className="!text-5xl text-center h-20"
                          value={formatCurrency(field.value)}
                          onChange={(e) => {
                            // Remove non-digits
                            const raw = e.target.value.replace(/\D/g, "");
                            // Parse into cents
                            const num = parseFloat(raw) / 100;
                            // Update form value
                            field.onChange(num.toFixed(2));
                          }}
                        />
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
