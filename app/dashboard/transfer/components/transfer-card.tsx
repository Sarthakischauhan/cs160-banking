"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

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
import { MoneyInput } from "../../deposit/components/money-input";
import { RecipientSearchResults } from "../components/recipient-search-result";
import { RecipientPreview } from "../components/recipient-preview";

type Transfer = {
  account_id: string | null;
  account_id2: string | null;
  amount: number | null;
  transaction_type: "immediate" | "scheduled";
  description: string | null;
  schedule_date?: string | null;
};

export function TransferCard({
  selectedRecipient,
  activeAccountId,
}: {
  selectedRecipient?: SearchRecipient | null;
  activeAccountId?: string;
}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<SearchRecipient | null>(null);

  const form = useForm<Transfer>({
    defaultValues: {
      account_id: null,
      account_id2: null,
      amount: null,
      transaction_type: "immediate",
      description: null,
      schedule_date: null,
    },
  });

  useEffect(() => {
    if (selectedRecipient) {
      setRecipient(selectedRecipient);
      form.setValue("account_id2", selectedRecipient.account_id);
    }
  }, [selectedRecipient, form]);

  const searchRecipients = async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/recipients?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipient = (user: SearchRecipient) => {
    setRecipient(user);
    form.setValue("account_id2", user.account_id);
    setQuery(user.name);
    setResults([]);
  };

  const handleSubmit = async (values: Transfer) => {
    if (!activeAccountId || !recipient) return;

    const payload = {
      from_account_id: activeAccountId,
      to_account_id: recipient.account_id,
      amount: Number(values.amount),
      description: values.description,
      transaction_type: values.transaction_type,
      schedule_date: values.schedule_date,
    };

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;

    router.push("/dashboard");
  };

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Transfer</CardTitle>
        <CardDescription>Transfer funds securely</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <FormDescription>Amount to transfer</FormDescription>
                  <RecipientPreview user={recipient} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipient Search */}
            <FormField
              control={form.control}
              name="account_id2"
              render={() => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    <div className="space-y-2 relative">
                      <Input
                        placeholder="Search by name or email"
                        value={query}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuery(val);
                          searchRecipients(val);
                        }}
                      />
                      {loading && (
                        <div className="text-sm text-gray-500">Searching...</div>
                      )}
                      <RecipientSearchResults
                        results={results}
                        onSelect={handleSelectRecipient}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Search and select a recipient</FormDescription>
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
                    <select className="border rounded-md p-2 w-full" {...field}>
                      <option value="immediate">Immediate</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </FormControl>
                  <FormDescription>Select transfer type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Date - only show if scheduled */}
            {form.watch("transaction_type") === "scheduled" && (
              <FormField
                control={form.control}
                name="schedule_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>Select the date to execute this payment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this for?"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Optional memo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="default">
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
