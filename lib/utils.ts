import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(v: number | string) {
  let value = v
  if (typeof v === "string") {
    value = parseFloat(v);
  }
  console.log(typeof(value));
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function censorString(s: string) {
  return "********" + s.slice(s.length - 4, s.length)
}

export const dataFormatter: Record<string, (value: any) => React.ReactNode> = {
  amount: (v: number | string) => formatCurrency(v),
  balance: (v: number | string) => formatCurrency(v),
  date: (v) => new Date(v).toLocaleDateString(),
  createdAt: (v) => new Date(v).toLocaleDateString(),
  created_at: (v) => new Date(v).toLocaleDateString(),
  updated_at: (v) => new Date(v).toLocaleDateString(),
  limit_amount: (v) => v ? v : "No limit"
};
