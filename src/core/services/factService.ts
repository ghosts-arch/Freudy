import { sql } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schema from "../../database/schema";
export class FactService {
	constructor(private database: BunSQLiteDatabase<typeof schema>) {}

	getRandomFact = async (): Promise<typeof schema.dailyFacts.$inferSelect> => {
		const [fact] = await this.database
			.select()
			.from(schema.dailyFacts)
			.orderBy(sql`RANDOM()`)
			.limit(1);
		if (!fact) throw new Error();
		return fact;
	};
}
