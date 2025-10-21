import { eq, sql } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { User } from "@/types";
import { isValidDiscordId } from "@/utils/checkDiscordId";
import type * as schema from "../database/schema";
import { users } from "../database/schema";

export class UserService {
	constructor(private database: BunSQLiteDatabase<typeof schema>) {}

	getUser = async (userId: string): Promise<User | null> => {
		if (!isValidDiscordId(userId)) throw new Error();
		const [user] = await this.database
			.select()
			.from(users)
			.where(eq(users.userId, userId))
			.limit(1);
		if (!user) return null;
		return user;
	};

	createUser = async (userId: string): Promise<User> => {
		if (!isValidDiscordId(userId)) throw new Error();
		const [user] = await this.database
			.insert(users)
			.values({ userId })
			.returning();
		if (!user) throw new Error();
		return user;
	};

	getOrCreateUser = async (userId: string): Promise<User> => {
		if (!isValidDiscordId(userId)) throw new Error();
		let user = await this.getUser(userId);
		if (!user) user = await this.createUser(userId);
		return user;
	};

	setExperience = async (userId: string, amount: number): Promise<User> => {
		if (!isValidDiscordId(userId)) throw new Error();
		const [updatedUser] = await this.database
			.update(users)
			.set({ experience: sql`${users.experience} + ${amount}` })
			.where(eq(users.userId, userId))
			.returning();
		if (!updatedUser) throw new Error();
		return updatedUser;
	};

	addLevel = async (userId: string): Promise<User> => {
		if (!isValidDiscordId(userId)) throw new Error();
		const [updatedUser] = await this.database
			.update(users)
			.set({ level: sql`${users.level} + 1` })
			.where(eq(users.userId, userId))
			.returning();
		if (!updatedUser) throw new Error();
		return updatedUser;
	};
}
