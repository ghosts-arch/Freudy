import { Database, SQLiteError } from "bun:sqlite";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	expectTypeOf,
	test,
} from "bun:test";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "../../src/core/database/schema";
import { UserService } from "../../src/core/services/userService";

describe("UserService", () => {
	let database: BunSQLiteDatabase<typeof schema>;
	let db: Database;
	let userService: UserService;
	beforeEach(async () => {
		db = new Database(":memory:");
		database = drizzle(db, { schema: schema });
		migrate(database, {
			migrationsFolder: "drizzle",
		});
		userService = new UserService(database);
	});

	describe("test constraints", () => {
		test("pass null userId should raise NOT NULL constraint error", async () => {
			try {
				await database
					.insert(schema.users)
					//@ts-expect-error
					.values({ userId: null })
					.returning();
				throw new Error(
					"ERROR : NOT NULL constraint on users.user_id was violated",
				);
			} catch (error) {
				if ((error as Error).message.startsWith("ERROR :")) throw error;
				expect(error).toBeInstanceOf(SQLiteError);
				expect((error as Error).message).toContain(
					"NOT NULL constraint failed: users.user_id",
				);
			}
		});
		test("pass null experience should raise NOT NULL constraint error", async () => {
			try {
				await database
					.insert(schema.users)
					//@ts-expect-error
					.values({ userId: "467818337599225866", experience: null })
					.returning();
				throw new Error(
					"ERROR : NOT NULL constraint on users.experience was violated",
				);
			} catch (error) {
				if ((error as Error).message.startsWith("ERROR :")) throw error;
				expect(error).toBeInstanceOf(SQLiteError);
				expect((error as Error).message).toContain(
					"NOT NULL constraint failed: users.experience",
				);
			}
		});
		test("pass null level should raise NOT NULL constraint error", async () => {
			try {
				await database
					.insert(schema.users)
					//@ts-expect-error
					.values({ userId: "467818337599225866", experience: 0, level: null })
					.returning();
				throw new Error(
					"ERROR : NOT NULL constraint on users.level was violated",
				);
			} catch (error) {
				if ((error as Error).message.startsWith("ERROR :")) throw error;
				expect(error).toBeInstanceOf(SQLiteError);
				expect((error as Error).message).toContain(
					"NOT NULL constraint failed: users.level",
				);
			}
		});
	});

	describe("createUser", () => {
		test("should return user data", async () => {
			const userId = "467818337599225866";
			const user = await userService.createUser(userId);
			expect(user).not.toBeNull();
			if (!user) return;
			expect(user.experience).toBe(0);
			expect(user.id).toBeNumber();
			expect(user.level).toBe(0);
			expect(user.userId).toBe(userId);
		});
	});

	describe("getUser", () => {
		test("shoud raise error if invalid userId format", async () => {
			expect(userService.getUser("")).rejects.toThrow();
		});
		test("should return null if user does not exist on database", async () => {
			const user = await userService.getUser("467818337599225866");
			expect(user).toBe(null);
		});

		test("should return user data", async () => {
			const userId = "467818337599225866";
			const [targetUser] = await database
				.insert(schema.users)
				.values({ userId })
				.returning();
			if (targetUser === undefined) return;
			const user = await userService.getUser(targetUser.userId);
			expect(user).not.toBeNull();
			if (!user) return;
			expect(user).toEqual(
				expect.objectContaining({
					userId: userId,
					level: 0,
					experience: 0,
					id: 1,
				}),
			);
			expectTypeOf(user).toMatchObjectType<typeof schema.users.$inferSelect>();
		});
	});

	test("set experience", async () => {
		const userId = "467818337599225866";
		const amount = 50;
		const user = await userService.createUser(userId);
		expect(user).not.toBeNull();
		if (!user) return;
		expect(user.experience).toBe(0);
		const updatedUser = await userService.setExperience(user.userId, amount);
		expect(updatedUser.experience).toBe(amount);
	});

	test("set level", async () => {
		const userId = "467818337599225866";
		const user = await userService.createUser(userId);
		expect(user).not.toBeNull();
		if (!user) return;
		expect(user.level).toBe(0);
		const updatedUser = await userService.addLevel(user.userId);
		expect(updatedUser.level).toBe(1);
	});

	afterEach(async () => {
		db.close();
	});
});
