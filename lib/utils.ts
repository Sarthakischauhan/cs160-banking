import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: string | number) {
  if (!value || value === "NaN" || value == 0) return "";
  const num = parseFloat(value.toString());
  return num.toFixed(2);
}
