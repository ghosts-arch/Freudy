import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

export const db: BunSQLiteDatabase<typeof schema> = drizzle(
	process.env.DB_FILE_NAME,
	{ schema },
);
