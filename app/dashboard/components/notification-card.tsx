import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Check } from 'lucide-react';

// We can either retrieve notifications in here, or in the page file and pass it as a prop.
// This is the same dilemma with balance


// Here is some sample data to show what notifs would look like on the dashboard
const sampleNotifs = [
  {
    id: 1,
    type: "transaction",
    message:
      "Your deposit of $1,250.00 has been posted to Checking Account •••• 1234.",
    date: "2025-09-29T09:45:00Z",
    read: false,
  },
  {
    id: 2,
    type: "security",
    message:
      "A new device signed in from San Jose, CA. If this wasn’t you, please secure your account.",
    date: "2025-09-28T21:30:00Z",
    read: false,
  },
  {
    id: 3,
    type: "payment",
    message: "Your scheduled payment of $85.20 to PG&E has been completed.",
    date: "2025-09-27T15:00:00Z",
    read: true,
  },
  {
    id: 4,
    type: "low_balance",
    message: "Your Savings Account •••• 5678 balance dropped below $100.00.",
    date: "2025-09-26T11:20:00Z",
    read: true,
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

export function NotificationCard() {
  return (
    <>
      <Card className="h-70">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>

        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {sampleNotifs.map((notification) => (
                    <TableRow key={notification.id}>
                        <TableCell>{notification.type}</TableCell>
                        <TableCell>{truncateStringWithEllipsis(notification.message, 40)}</TableCell>
                        <TableCell>{new Date(notification.date).toLocaleDateString()}</TableCell>
                        <TableCell>{notification.read ? <Check /> : <></>}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
