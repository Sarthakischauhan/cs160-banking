import { prisma, supabase } from './prisma1.js';

// This script populates missing accounts for existing customers
async function main() {
  const customers = await prisma.customer.findMany();

  for (const customer of customers) {
    const customerId = customer.customer_id;

    const { data: existingAccount, error: accountError } = await supabase
      .from('Account')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (accountError && accountError.code !== 'PGRST116') { // 116 = no rows
      console.error(`❌ Error fetching account for customer ${customerId}:`, accountError);
      continue;
    }

    // If account already exists, just log it and continue
    if (existingAccount) {
      console.log(`✅ Existing account found for customer ${customerId} with balance: ${existingAccount.balance}`);
      continue;
    }

    // Otherwise, create a new account
    const { data: newAccount, error: createError } = await supabase
      .from('Account')
      .insert({
        customer_id: customerId,
        balance: 0,
        created_at: new Date(),
        updated_at: new Date(),
        account_type: 'CHECKING',
        account_status: 'ACTIVE',
      })
      .select();

    if (createError) {
      console.error(`❌ Error creating account for customer ${customerId}:`, createError);
      continue;
    }

    if (!newAccount || newAccount.length === 0) {
      console.error(`⚠️ No account returned for customer ${customerId}`);
      continue;
    }

    const newAccountPrisma = await prisma.Account.findUnique({
      where: { account_id: newAccount[0].account_id },
    });

    console.log(`🆕 New account created for customer ${customerId} has balance: ${newAccountPrisma.balance}`);
  }

  console.log("🎉 Finished processing all customers");
}

main()
  .catch((e) => {
    console.error('Unhandled error in main():', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
