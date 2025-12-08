"use client";

import { LogOut } from "lucide-react";

// LogoutButton.tsx
export const LogoutButton = () => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      window.location.href = "/auth/logout";
    }}
    className="flex items-center justify-center w-full gap-2 px-4 py-2 text-red-600 dark:text-red-400 font-medium rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors hover:cursor-pointer"
  >
    <LogOut className="w-5 h-5" />
    <span className="text-lg">Logout</span>
  </button>
);


export default LogoutButton;
