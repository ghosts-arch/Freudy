import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Sequelize } from "sequelize";
import { initModel, User } from "../../src/database/models/User";
import {
	addLevel,
	createUser,
	getUser,
	setExperience,
} from "../../src/services/userService";

describe("Testing user related functions", () => {
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

	test("create user", async () => {
		const userId = "467818337599225866";
		const user = await createUser(userId);
		expect(user).toBeInstanceOf(User);
	});

	test("getUser with non-existant discord id", async () => {
		const user = await getUser("467818337599225866");
		expect(user).toBeNull();
	});

	test("getUser with existing discord id", async () => {
		const userId = "467818337599225866";
		await User.create({ userId: userId });
		const user = await getUser(userId);
		expect(user).toBeInstanceOf(User);
	});

	test("setExperience", async () => {
		const userId = "467818337599225866";
		const amount = 50;
		const user = await createUser(userId);
		expect(user.experience).toBe(0);
		const updatedUser = await setExperience(user, amount);
		expect(updatedUser.experience).toBe(amount);
	});

	test("setLevel", async () => {
		const userId = "467818337599225866";
		const user = await createUser(userId);
		expect(user.level).toBe(0);
		await addLevel(user);
		expect(user.level).toBe(1);
	});

	afterEach(async () => {
		await sequelize.close();
	});
});
