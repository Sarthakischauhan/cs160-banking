import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.SUPABASEURL;
const supabaseKey = process.env.SUPABASEKEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const prisma = new PrismaClient();
