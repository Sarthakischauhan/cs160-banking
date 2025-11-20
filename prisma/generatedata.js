import {prisma, supabase} from './prisma1.js';

async function main() {
  const customers = await prisma.customer.findMany();
 
  for (const customer of customers) {
    const customerId = customer.customer_id;
   
  const { data: existingAccount, error: accountError } = await supabase
    .from('Account')
    .select('*')
    .eq('customer_id', customerId)
    .single();


    if (!existingAccount) {
     
        const { data: newAccount, error: createError } = await supabase
          .from('Account')
          .insert({
          // SupaBase will auto create account_id as it's the primary key
          customer_id: customerId,
          balance: 0,
          created_at: new Date(),
          updated_at: new Date(),
          account_type: 'CHECKING',
          account_status: 'ACTIVE',
          })
        .select()

        console.log(newAccount, createError);
   
    if (newAccount && Array.isArray(newAccount) && newAccount.length > 0) {
      const newAccountPrisma = await prisma.account.findUnique({
        where: { account_id: newAccount[0].account_id }
      });
      console.log(`New account for customer ${customerId} has balance:`, newAccountPrisma?.balance);
    } else {
      console.error(`Failed to create account for customer ${customerId}: newAccount is null or empty.`);
    }
   
  }
    console.log("works");
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
