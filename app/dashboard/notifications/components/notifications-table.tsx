"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BadgeDollarSign, Key, Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Notifications } from "@prisma/client";
import { dismissNotificationsBatch } from "@/lib/notification";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 

type NotificationType = "TRANSACTION" | "SYSTEM" | "SECURITY" | "GENERAL" | null;

export function NotificationsPageTable({
  initialNotifications,
}: {
  initialNotifications: Notifications[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [checkedSet, setCheckedSet] = useState<Set<bigint>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleCheck = (id: bigint, checked: boolean | "indeterminate") => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      checked === true ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const toggleCheckAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      // Check all visible notifications
      const allIds = new Set(notifications.map(n => n.id));
      setCheckedSet(allIds);
    } else {
      // Uncheck all
      setCheckedSet(new Set());
    }
  };

  const checkAllState: boolean | "indeterminate" = 
    notifications.length > 0 && checkedSet.size === notifications.length
      ? true
      : notifications.length > 0 && checkedSet.size > 0
        ? "indeterminate"
        : false;

  const handleMarkAsRead = async () => {
    const ids = Array.from(checkedSet);
    if (!ids.length) return;

    setLoading(true);
    try {
      await dismissNotificationsBatch(ids); 
      
      setNotifications((prev) => prev.filter((n) => !checkedSet.has(n.id)));
      setCheckedSet(new Set()); // Clear checked set after successful dismissal
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Message Column */}
              <TableHead>Message</TableHead>
              {/* Date Column */}
              <TableHead className="text-right w-[200px]">Date</TableHead>
              
              {/* CHECKBOX MOVED TO THE END */}
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={checkAllState}
                  onCheckedChange={toggleCheckAll}
                  aria-label="Select all notifications"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <TableRow 
                  key={n.id}
                  className={checkedSet.has(n.id) ? "bg-accent/30" : ""} 
                >
                  {/* Message Cell */}
                  <TableCell>
                    <div className="text-sm font-medium">
                      {n.message}
                    </div>
                  </TableCell>
                  {/* Date Cell */}
                  <TableCell className="text-right text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center">
                    <Checkbox
                      checked={checkedSet.has(n.id)}
                      onCheckedChange={(v) => toggleCheck(n.id, v)}
                      aria-label={`Select notification ${n.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  You're all caught up
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex justify-end">
        {checkedSet.size > 0 && (
          <Button
            size="sm"
            onClick={handleMarkAsRead}
            disabled={loading}
          >
            {loading ? "Marking…" : `Mark ${checkedSet.size} as read`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}