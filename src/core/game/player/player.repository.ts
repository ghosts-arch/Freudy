import { eq } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schema from "@/core/database/schema";

export class PlayerRepository {
	private declare database;
	constructor(database: BunSQLiteDatabase<typeof schema>) {
		this.database = database;
	}

	createUser = async (
		userId: string,
	): Promise<typeof schema.users.$inferInsert> => {
		const [user] = await this.database
			.insert(schema.users)
			.values({ userId })
			.returning();
		if (!user) throw new Error();
		return user;
	};

	getUser = async (
		userId: string,
	): Promise<typeof schema.users.$inferSelect | null> => {
		const [user] = await this.database
			.select()
			.from(schema.users)
			.where(eq(schema.users.userId, userId))
			.limit(1);
		if (!user) return null;
		return user;
	};

	updatePosition = async (userId: string, newPosition: number) => {
		await this.database
			.update(schema.users)
			.set({ position: newPosition })
			.where(eq(schema.users.userId, userId));
	};
}
