import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { censorString, formatCurrency } from "@/lib/utils";
import { Customer, Notifications } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Check, X } from "lucide-react";

type NotificationsType = Notifications & {
  Customer: Customer | null;
};

function NotificationTable({
  notifications,
}: {
  notifications: NotificationsType[];
}) {
  console.log(notifications);
  return (
    <div className="w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Notifcation Type</TableHead>
            <TableHead>Dismissed</TableHead>
            <TableHead>Delivery Method</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification: NotificationsType) => (
            <TableRow key={notification.id}>
              {notification.Customer ? (
                <>
                  <TableCell className="max-w-[120px]">
                    {notification.Customer.first_name?.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell className="max-w-[120px]">
                    {notification.Customer.last_name?.toLocaleUpperCase()}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </>
              )}
              <TableCell>{notification.customer && censorString(notification.customer)}</TableCell>
              <TableCell className="truncate max-w-[120px]">{notification.message}</TableCell>
              <TableCell>{notification.notification_type}</TableCell>
              <TableCell>{notification.dismissed ? <Check /> : <X />}</TableCell>
              <TableCell>{notification.delivery_method}</TableCell>
              <TableCell>
                {new Date(notification.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default NotificationTable;
