"use client";

import { useState } from "react";
import Link from "next/link";
import {
  House,
  Bell,
  FileText,
  UserCog,
  ArrowLeftRight,
  Ticket,
  Landmark,
  Menu,
  X,
} from "lucide-react";

export function TopDrawerNav() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: House },
    { title: "Notifications", url: "/admin/dashboard/notifications", icon: Bell },
    { title: "Reports", url: "/admin/dashboard/reports", icon: FileText },
    { title: "Account Management", url: "/admin/dashboard/account-management", icon: UserCog },
    { title: "Transactions", url: "/admin/dashboard/transactions", icon: ArrowLeftRight },
    { title: "Support Tickets", url: "/admin/dashboard/support-tickets", icon: Ticket },
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="sm:hidden p-2 m-2 rounded-md"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-background/50 z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer sliding from the top */}
      <div
        className={`
          fixed top-0 left-0 w-full bg-background z-50 transform transition-transform
          ${open ? "translate-y-0" : "-translate-y-full"}
          sm:hidden border-b border-border
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div className="flex items-center">
            <Landmark className="mr-2" />
            <h1 className="text-xl font-semibold">Online Bank</h1>
          </div>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col p-4 space-y-3 text-foreground">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              onClick={() => setOpen(false)}
              className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2"
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </Link>
          ))}

          {/* Logout */}
          <Link
            href="/auth/logout"
            onClick={() => setOpen(false)}
            className="mt-4 border border-border rounded-md text-center py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Logout
          </Link>
        </nav>
      </div>
    </>
  );
}
