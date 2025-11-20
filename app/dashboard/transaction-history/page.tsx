import { prisma } from "@/prisma/prisma";
import { TransactionTableCard } from "./components/transactiontable-card";
import { auth0 } from "@/lib/auth0";

export default async function TransactionHistoryPage() {
  // Get the current authenticated user session
  const session = await auth0.getSession();

  if (!session) {
    return <div>Please log in to view your transactions.</div>;
  }

  // Find the customer_id for the logged-in user
  const customer = await prisma.customer.findFirst({
    where: { auth0_user_id: session.user.sub },
    select: { customer_id: true },
  });

  if (!customer) {
    return <div>No customer found for this user.</div>;
  }

  // Get all transactions for accounts owned by this customer
  const transactions = await prisma.transaction.findMany({
    where: {
      Account: {
        customer_id: customer.customer_id,
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="w-full h-full">
      <div className="p-10">
        <h1 className="text-4xl font-bold">Transaction History</h1>
      </div>
      <div className="grid justify-items-center">
        <TransactionTableCard
          transactions={transactions}
          activeAccountId={customer.customer_id} // or some default account id
        />
      </div>
    </div>
  );
}
