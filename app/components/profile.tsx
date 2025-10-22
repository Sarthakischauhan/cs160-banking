"use client";

import { useEffect, useState } from "react";

type Customer = {
  first_name: string;
  last_name: string;
  email: string;
  // other fields like address, phone, account_type
};

export function ProfilePage({ session, roles }: { session: any; roles: string[] }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/customer");
      if (res.status === 401) {
      window.location.href = "/auth/login";
      return;
      }
      const data = await res.json();
      setCustomer(data);

    if (data.first_name === null) {
      await createProfile(); 
    }
    }
    fetchProfile();

  }, []);

  async function createProfile() {
  const res = await fetch("/api/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: null, 
      last_name: null,
      address: null,
      phone: null,
      account_type: null,
      email: null, 
    }),
  });

  const data = await res.json();
  setCustomer(data); 
}

  if (!customer) return <p>Loading...</p>;

  return (
    <main>
      <p>Logged in as: {customer.first_name} {customer.last_name}</p>
      <p>Email: {customer.email ?? session.user.email}</p>
      <p>Roles: {roles.join(", ") || "No roles assigned"}</p>
      <div>
        <a href="/admin">Admin Dashboard</a>
      </div>
      <div>
        <a href="/protected">Protected page</a>
      </div>
      <div>
        <a href="/auth/logout">Log Out</a>
      </div>
    </main>
  );
}
