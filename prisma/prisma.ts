import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL!;

// create a single Postgres pool
const pool = new Pool({ connectionString });

// create the adapter
const adapter = new PrismaPg(pool);

// singleton PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({ adapter, log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
