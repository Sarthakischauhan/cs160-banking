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
          account_type: 'null',
          account_status: 'active',
          })
        .select()
   
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
// Supabase auto creates primary key
// async function createId() {
//     const { data: maxAccount, error: maxError } = await supabase
//     .from('Account')
//     .select('account_id')
//     .order('account_id', { ascending: false })
//     .limit(1)
//     .single();


//     if (!maxAccount) {
//     return "1";
//   }


//     return String(Number(maxAccount.account_id) + 1); // returns 1 bigger than biggest acountId number
   
// }


main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
