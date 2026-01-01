import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { Database } from "bun:sqlite";

const sqlite = new Database(process.env.DB_FILE_NAME)
export const db: BunSQLiteDatabase<typeof schema> = drizzle(
	{ client : sqlite, schema },
);
