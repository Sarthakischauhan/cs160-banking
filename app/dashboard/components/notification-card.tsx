"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { set } from "react-hook-form";

// We can either retrieve notifications in here, or in the page file and pass it as a prop.
// This is the same dilemma with balance

// Here is some sample data to show what notifs would look like on the dashboard
let sampleNotifs = [
  {
    id: 1,
    type: "transaction",
    title: "Deposit Posted",
    message:
      "Your deposit of $1,250.00 has been posted to Checking Account •••• 1234.",
    date: "2025-09-29T09:45:00Z",
    read: false,
    actionUrl: "/accounts/checking/transactions/12345",
    icon: "DollarSign",
  },
  {
    id: 2,
    type: "security",
    title: "New Device Login",
    message:
      "A new device signed in from San Jose, CA. If this wasn’t you, please secure your account.",
    date: "2025-09-28T21:30:00Z",
    read: false,
    actionUrl: "/settings/security",
    icon: "ShieldAlert",
  },
  {
    id: 3,
    type: "payment",
    title: "Bill Payment Completed",
    message: "Your scheduled payment of $85.20 to PG&E has been completed.",
    date: "2025-09-27T15:00:00Z",
    read: true,
    actionUrl: "/payments/4567",
    icon: "CreditCard",
  },
  {
    id: 4,
    type: "low_balance",
    title: "Low Balance Alert",
    message: "Your Savings Account •••• 5678 balance dropped below $100.00.",
    date: "2025-09-26T11:20:00Z",
    read: true,
    actionUrl: "/transfers/new",
    icon: "AlertTriangle",
  },
  {
    id: 5,
    type: "promotion",
    title: "New Savings Bonus",
    message:
      "Earn 4.25% APY when you open a new High-Yield Savings Account before Oct 15.",
    date: "2025-09-25T08:00:00Z",
    read: false,
    actionUrl: "/promotions/high-yield-savings",
    icon: "Gift",
  },
];

/**
 * Truncates a long string and adds an ellipsis at the end
 * @param str The message string to be truncated
 * @param num The max length of the message before truncation
 * @returns Truncated string with an ellipsis at the end
 */
function truncateStringWithEllipsis(str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

export function NotificationCard({ full }: { full?: boolean }) {
  const [notifications, setNotifications] = useState(sampleNotifs);

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seen</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Sent</TableHead>

                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(full ? notifications : notifications.slice(0, 4)).map(
                (notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="flex justify-center">
                      <Checkbox
                        checked={notification.read}
                        onCheckedChange={(checked) => {
                          setNotifications((prevNotifs) =>
                            prevNotifs.map((notif) =>
                              notif.id === notification.id
                                ? { ...notif, read: checked as boolean }
                                : notif
                            )
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>
                      {full
                        ? truncateStringWithEllipsis(notification.message, 120)
                        : truncateStringWithEllipsis(notification.message, 40)}
                    </TableCell>
                    <TableCell>
                      {new Date(notification.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          {full ? (
            <p className="text-center text-gray-500 mt-4">
              No other notifications
            </p>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </>
  );
}
