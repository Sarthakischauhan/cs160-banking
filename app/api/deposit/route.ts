import { supabase } from '@/prisma/prisma';

async function printActiveAccounts() {
  const { data, error } = await supabase
    .from('Account')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error("Error fetching accounts:", error);
  } else {
    console.log("Active accounts:", data);
  }
}

// Call the function
printActiveAccounts();