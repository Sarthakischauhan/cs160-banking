import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentRecipients = [
  {
    id: "u12345",
    name: "Alex Johnson",
    accountNumber: "123456789",
    email: "alex.johnson@example.com",
    phone: "+1 (408) 555-2184",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastTransferred: "2025-10-01",
  },
  {
    id: "u67890",
    name: "Maria Lopez",
    accountNumber: "987654321",
    email: "maria.lopez@example.com",
    phone: "+1 (213) 555-6432",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    lastTransferred: "2025-10-03",
  },
  {
    id: "u24680",
    name: "David Kim",
    accountNumber: "246802468",
    email: "david.kim@example.com",
    phone: "+1 (415) 555-9974",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    lastTransferred: "2025-10-05",
  },
  {
    id: "u13579",
    name: "Sofia Chen",
    accountNumber: "135791357",
    email: "sofia.chen@example.com",
    phone: "+1 (650) 555-3112",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    lastTransferred: "2025-10-06",
  },
  {
    id: "u54321",
    name: "Michael Rodriguez",
    accountNumber: "543216789",
    email: "michael.rodriguez@example.com",
    phone: "+1 (510) 555-8765",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    lastTransferred: "2025-09-29",
  },
];

export function RecentTransfersCard({onSelect}: {onSelect?: (id: string) => void}) {
  return (
    <>
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>
            Quick access to your frequent recipients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 max-h-72 overflow-y-auto mx-2 w-fit">
            {recentRecipients.slice(0, 4).map((recipient) => (
              <Card key={recipient.id} className="w-git m-1 bg-transparent hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200" onClick={() => onSelect ? onSelect(recipient.email) : {}}>
                <CardContent>
                  <span className="font-bold text-center">
                    {recipient.name}
                  </span>
                  <div className="flex items-center flex-row">
                    <div className="flex items-center">
                      <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="h-12 w-12 object-cover rounded-full"
                      />
                    </div>
                    <div className="mx-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          Acct: ****{recipient.accountNumber.slice(-4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 text-wrap">
                          {recipient.email}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last:{" "}
                        {new Date(
                          recipient.lastTransferred
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
