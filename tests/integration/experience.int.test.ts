import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Sequelize } from "sequelize";
import { initModel } from "../../src/database/models/User";
import {
	getTitle,
	processLevelProgression,
} from "../../src/services/experienceService";
import { createUser } from "../../src/services/userService";

describe("experience integration", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
		});
		initModel(sequelize);
		await sequelize.sync({ force: true });
	});

	test("process level progression", async () => {
		let hasLevelUp: boolean | undefined;
		const user = await createUser("467818337599225866");
		expect(user.level).toBe(0);
		expect(user.experience).toBe(0);
		expect(getTitle(user.level)).toBe("Apprenti Freudy");
		hasLevelUp = await processLevelProgression(user);
		expect(hasLevelUp).toBeFalse();
		expect(user.level).toBe(0);
		expect(user.experience).toBe(10);
		expect(getTitle(user.level)).toBe("Apprenti Freudy");
		await processLevelProgression(user);
		await processLevelProgression(user);
		await processLevelProgression(user);
		hasLevelUp = await processLevelProgression(user);
		expect(hasLevelUp).toBeTrue();
		expect(user.level).toBe(1);
		expect(user.experience).toBe(50);
		expect(getTitle(user.level)).toBe("Disciple de Freud");
	});

	afterEach(async () => {
		await sequelize.close();
	});
});
