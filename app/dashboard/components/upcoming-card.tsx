"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function UpcomingCard() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/autopayment");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Error loading scheduled payments:", err);
      }
    }
    fetchPayments();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Upcoming Payments</CardTitle>
        <Link href="/dashboard/automated-payments" passHref>
          <Button variant="secondary" size="sm">
            Manage Automated Payments
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-4 my-2 font-semibold">
          <span className="col-span-2">Description</span>
          <span>Amount</span>
          <span>Date</span>
        </div>

        {payments.length === 0 && (
          <p className="text-sm text-muted-foreground">No upcoming payments</p>
        )}

        {payments.map((payment: any) => (
          <div className="grid grid-cols-4 my-2" key={payment.transaction_id}>
            <span className="col-span-2">{payment.description}</span>
            <span>${Number(payment.amount).toFixed(2)}</span>
            <span>{new Date(payment.scheduled).toLocaleDateString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
