import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';


const connectionString = `${process.env.DIRECT_URL}`
const supabaseUrl = process.env.SUPABASEURL ?? '';
const supabaseKey = process.env.SUPABASEKEY ?? '';
export const supabase = createClient(supabaseUrl, supabaseKey);

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter });