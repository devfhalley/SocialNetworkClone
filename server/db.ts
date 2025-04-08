import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a postgres connection
const client = postgres(process.env.DATABASE_URL!);

// Create a drizzle client with the postgres connection
export const db = drizzle(client, { schema });