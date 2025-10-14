import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Sequelize } from "sequelize";
import {
	Answer,
	initModel as initAnswersModel,
} from "../../src/database/models/answer";
import {
	initModel as initQuestionsModel,
	Question,
} from "../../src/database/models/question";
import {
	getQuestionsCount,
	getRandomQuestion,
} from "../../src/services/questionsService";

describe("Testing questions related functions", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
		});
		initQuestionsModel(sequelize);
		initAnswersModel(sequelize);

		Question.hasMany(Answer, { foreignKey: "questionId", as: "answers" });
		Answer.belongsTo(Question, { foreignKey: "questionId", as: "question" });

		await sequelize.sync({ force: true });
	});

	test("get questions count", async () => {
		const questionsCount = await getQuestionsCount();
		expect(questionsCount).toBeNumber();
		expect(questionsCount).toBe(0);
	});

	test("get random question when database is empty", async () => {
		expect(getRandomQuestion()).rejects.toThrowError();
	});

	afterEach(async () => {
		await sequelize.close();
	});
});
