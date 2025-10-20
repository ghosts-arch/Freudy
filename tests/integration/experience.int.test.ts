import { Database } from "bun:sqlite";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "../../src/core/database/schema";
import {
	getTitle,
	processLevelProgression,
} from "../../src/core/services/experienceService";
import { UserService } from "../../src/core/services/userService";

describe("experience integration", () => {
	let database: BunSQLiteDatabase<typeof schema>;
	let db: Database;
	beforeEach(async () => {
		db = new Database(":memory:");
		database = drizzle(db, { schema: schema });
		migrate(database, {
			migrationsFolder: "drizzle",
		});
	});

	test("process level progression", async () => {
		let hasLevelUp: boolean | undefined;
		let updatedUser: typeof schema.users.$inferSelect;
		const userService = new UserService(database);
		const userId = "467818337599225866";
		const user = await userService.createUser("467818337599225866");
		expect(user).not.toBeNull();
		if (!user) return;
		expect(user.level).toBe(0);
		expect(user.experience).toBe(0);
		expect(getTitle(user.level)).toBe("Apprenti Freudy");
		[updatedUser, hasLevelUp] = await processLevelProgression(database, userId);
		expect(hasLevelUp).toBeFalse();
		expect(updatedUser.level).toBe(0);
		expect(updatedUser.experience).toBe(10);
		expect(getTitle(updatedUser.level)).toBe("Apprenti Freudy");
		await processLevelProgression(database, userId);
		await processLevelProgression(database, userId);
		await processLevelProgression(database, userId);
		[updatedUser, hasLevelUp] = await processLevelProgression(database, userId);
		expect(hasLevelUp).toBeTrue();
		expect(updatedUser.level).toBe(1);
		expect(updatedUser.experience).toBe(50);
		expect(getTitle(updatedUser.level)).toBe("Disciple de Freud");
	});

	afterEach(async () => {
		db.close();
	});
});
