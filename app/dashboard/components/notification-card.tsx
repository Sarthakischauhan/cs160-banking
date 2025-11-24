"use client";

import type { Notifications } from "@prisma/client";
import { BadgeDollarSign, Key, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dismissNotificationsBatch } from "@/lib/notification";

type NotificationType =
  | "TRANSACTION"
  | "SYSTEM"
  | "SECURITY"
  | "GENERAL"
  | null;

export function NotificationCard({
  notifications = [],
  render_type,
}: {
  notifications?: Notifications[];
  render_type: "COMPONENT" | "PAGE";
}) {
  const [checkedSet, setCheckedSet] = useState<Set<bigint>>(new Set());
  const [loading, setLoading] = useState(false);
  const toggleCheck = (id: bigint, checked: boolean | "indeterminate") => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (checked === true) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const typeIcon = (type: NotificationType) => {
    switch (type) {
      case "TRANSACTION":
        return <BadgeDollarSign className="w-5 h-5" />;
      case "SYSTEM":
        return <SettingsIcon className="w-5 h-5" />;
      case "SECURITY":
        return <Key className="w-5 h-5" />;
      default:
        return <span className="text-xl">🔔</span>;
    }
  };

  const handleMarkAsRead = async () => {
    const ids = Array.from(checkedSet);
    if (!ids.length) return;

    setLoading(true);
    try {
      await dismissNotificationsBatch(ids);
      // remove dismissed from UI
      setCheckedSet(new Set());
    } catch (err) {
      console.error("Dismiss failed:", err);
      alert("Failed to mark notificgations as read");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full relative">
      <CardHeader>
        <div>
          {render_type === "COMPONENT" && <CardTitle>Notifications</CardTitle>}
          <CardAction>
            <Link href="/dashboard/notifications">View All</Link>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Message</TableHead>
              {/* <TableHead>Account</TableHead> */}
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Dismiss</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="text-center">
                  {typeIcon(n.notification_type as NotificationType)}
                </TableCell>

                <TableCell className="font-medium truncate max-w-[200px]">
                  {n.message}
                </TableCell>
                {/* 
                <TableCell className="text-sm text-muted-foreground">
                  {n.account_id}
                </TableCell> */}

                <TableCell className="text-sm text-muted-foreground">
                  {n.created_at.toLocaleDateString()}
                </TableCell>

                <TableCell className="text-center">
                  <Checkbox
                    checked={checkedSet.has(n.id)}
                    onCheckedChange={(v) => toggleCheck(n.id, v)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {notifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No notifications
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        {checkedSet.size > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAsRead}
            disabled={loading}
          >
            {loading ? "Marking..." : "Mark as Read"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
