"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account, AccountType } from "@prisma/client";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  account_type: z.string(),
  annual_income: z.string(),
  employment_status: z.string(),
  inital_amount: z.number().min(0).max(100),
});

const annualIncome = ["0-50k", "50k-100k", "100k-250k", "250k+"];

const accountTypeArray = Object.values(AccountType);

const employmentStatus = ["EMPLOYED", "UNEMPLOYED", "SELF-EMPLOYED"];

export function AccountForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        account_type:
          AccountType[values.account_type as keyof typeof AccountType],
        initial_balance: new Decimal(values.inital_amount),
      };

      const result = await fetch("/api/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!result) {
        throw new Error("Couldn't create account");
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="account_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountTypeArray.map((account, key) => {
                    return (
                      <SelectItem key={key} value={account}>
                        {account}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="annual_income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Income</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select income" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {annualIncome.map((income, key) => {
                    return (
                      <SelectItem key={key} value={income}>
                        {income}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                Annual income as mentioned on tax filing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employment_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Employment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employmentStatus.map((status, key) => {
                    return (
                      <SelectItem key={key} value={status}>
                        {status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>You can always change it</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inital_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inital Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="00.00"
                  type="number"
                  {...form.register("inital_amount", { valueAsNumber: true })}
                />
              </FormControl>
              <FormDescription>Initial amount you want to add</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </Form>
  );
}
