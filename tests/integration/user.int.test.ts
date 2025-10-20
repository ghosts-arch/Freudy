import { Database } from "bun:sqlite";
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
import * as schema from "../../src/database/schema";
import { UserService } from "../../src/services/userService";

describe("Testing user related functions", () => {
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

	test("create user", async () => {
		const userId = "467818337599225866";
		const user = await userService.createUser(userId);
		expect(user).not.toBeNull();
		if (!user) return;
		expect(user.experience).toBe(0);
		expect(user.id).toBeNumber();
		expect(user.level).toBe(0);
		expect(user.userId).toBe(userId);
		expectTypeOf(user).toMatchObjectType<typeof schema.users.$inferSelect>();
	});

	test("get inexistant user", async () => {
		const user = await userService.getUser("467818337599225866");
		expect(user).toBe(null);
	});

	test("get existant user", async () => {
		const userId = "467818337599225866";
		const [targetUser] = await database
			.insert(schema.users)
			.values({ userId })
			.returning();
		if (targetUser === undefined) return;
		const user = await userService.getUser(targetUser.userId);
		expect(user).not.toBeNull();
		if (!user) return;
		expectTypeOf(user).toMatchObjectType<typeof schema.users.$inferSelect>();
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
