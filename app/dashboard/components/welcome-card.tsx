"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Customer = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export function WelcomeCard() {
   const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/customer");
      if (res.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      const data: Customer = await res.json();
      setCustomer(data);
    }

    fetchProfile();
  }, []);

  const username = customer
    ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim()
    : "User";

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {username}!</CardTitle>
                <CardDescription>This is your dashboard!</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Recap today's spending, your balance, and keep up with your finances! All on one app!</p>
            </CardContent>
            <CardFooter />
        </Card>
        </>
    )
}