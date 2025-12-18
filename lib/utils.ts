import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(v: number) {
  if (isNaN(v)) return "";
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function censorString(s: string) {
  return "********" + s.slice(s.length - 4, s.length);
}

export const dataFormatter: Record<string, (value: any) => React.ReactNode> = {
  amount: (v: number) => formatCurrency(v),
  balance: (v: number) => formatCurrency(v),
  date: (v) => new Date(v).toLocaleDateString(),
  createdAt: (v) => new Date(v).toLocaleDateString(),
  created_at: (v) => new Date(v).toLocaleDateString(),
  updated_at: (v) => new Date(v).toLocaleDateString(),
  scheduled: (v) => new Date(v).toLocaleDateString(),
  limit_amount: (v) => (v ? v : "No limit"),
  default: (value) => 
    value instanceof Date ? value.toLocaleString() : value,
  Customer: (c) => `${c.first_name} ${c.last_name}`,
  Handler: (h) => h ? `${h.first_name} ${h.last_name}` : "",
};

export function isValidUUID(id: string) {
  // Simple check for UUID v4 (works for most cases)
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
