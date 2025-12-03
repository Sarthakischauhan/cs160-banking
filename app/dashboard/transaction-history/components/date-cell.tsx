// components/FormattedDate.tsx
"use client";

export function FormattedDate({ date }: { date: string | Date }) {
  return (
    <span>
      {new Date(date).toLocaleDateString()}
    </span>
  );
}