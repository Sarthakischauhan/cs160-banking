"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

export function Switch({ checked, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full",
        "transition-colors duration-700 ease-in-out",
        checked ? "bg-green-600" : "bg-gray-400 dark:bg-gray-600",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-md",
          "transform transition-transform duration-700 ease-in-out",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}
