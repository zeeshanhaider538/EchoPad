// scripts/test-db.ts
import dotenv from "dotenv";
dotenv.config();

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
// console.log("DATABASE_URL:", process.env.DATABASE_URL);

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

async function main() {
  const result = await db.execute("select 1+1 as sum");
  console.log(result); // should print { sum: 2 }
  await client.end();
}

main();
