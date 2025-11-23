"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecentTransferUser } from "@/lib/transactions";

const DEFAULT_AVATAR = "https://avatar.vercel.sh";

type RecentTransfersCardProps = {
  onSelect: ({
    account_id,
    customer_name,
  }: {
    account_id: string;
    customer_name: string;
  }) => void;
  recentRecipients: RecentTransferUser[];
};

export function RecentTransfersCard({
  onSelect,
  recentRecipients,
}: RecentTransfersCardProps) {
  const hasRecipients = recentRecipients.length > 0;

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Recent Transfers
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Quick access to your frequent recipients
        </CardDescription>
      </CardHeader>

      <CardContent className="px-3">
        {hasRecipients ? (
          <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {recentRecipients.map((recipient) => (
              <div
                key={recipient.id}
                onClick={() => onSelect({account_id: recipient.id, customer_name: recipient.name} )}
                className="
                  w-full cursor-pointer rounded-xl border
                  p-3 transition-all
                  hover:bg-gray-100/20
                  active:scale-[0.98]
                "
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={`${DEFAULT_AVATAR}/${recipient.name}`}
                    alt={recipient.name}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                  <p className="text-sm font-semibold leading-tight">
                    {recipient.name}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-3 w-full space-y-1 text-xs text-gray-500">
                  <p>
                    Acct: ****{recipient.accountNumber.slice(-4)}
                  </p>
                  <p className="truncate">
                    {recipient.email ?? "No email on file"}
                  </p>
                  <p>
                    Last:{" "}
                    {new Date(
                      recipient.lastTransferred
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground px-2">
            No recent users
          </p>
        )}
      </CardContent>
    </Card>
  );
}
