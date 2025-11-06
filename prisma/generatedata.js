// scripts/generateTransactions.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // 1️⃣ Pick a customer (replace with a real customer_id)
    const customer = await prisma.customer.findFirst();
    if (!customer) {
      console.error("No customers found. Add a customer first.");
      return;
    }

    // 2️⃣ Get their accounts
    const accounts = await prisma.account.findMany({
      where: { customer_id: customer.customer_id },
    });

    if (accounts.length < 2) {
      console.error("Need at least 2 accounts to generate transfer transactions.");
      return;
    }

    const [fromAccount, toAccount] = accounts;

    // 3️⃣ Generate some random transactions
    const transactionsToCreate = Array.from({ length: 5 }, (_, i) => ({
      account_id: fromAccount.account_id,
      account_id2: toAccount.account_id,
      amount: Math.floor(Math.random() * 500) + 10, // random amount between 10 and 500
      amount_after_transaction: fromAccount.balance, // will be updated when processed
      description: `Test transaction ${i + 1}`,
      transaction_status: "PENDING",
      transaction_type: "IMMEDIATE",
      created_at: new Date(),
    }));

    const created = await prisma.transaction.createMany({
      data: transactionsToCreate,
    });

    console.log(`✅ Created ${created.count} test transactions for customer ${customer.customer_id}`);
  } catch (err) {
    console.error("❌ Error generating transactions:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
