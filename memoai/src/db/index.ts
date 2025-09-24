import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Create the client
const queryClient = postgres(process.env.DATABASE_URL as string);

// Pass client into drizzle
export const db = drizzle(queryClient);
