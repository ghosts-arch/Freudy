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
	createQuestion,
	getQuestionsCount,
	getRandomQuestion,
	type QuestionData,
} from "../../src/services/questionsService";

const createSampleQuestion = (
	withExplanation: boolean = true,
): QuestionData => {
	return {
		question: `question_placeholder_${Date.now()}`,
		explanation: withExplanation
			? `explanation_placeholder_${Date.now()}`
			: undefined,
		answers: Array.from({ length: 4 }, (_, i) => ({
			text: `text_${i}`,
			isValidAnswer: i === 1,
		})),
	};
};
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

	describe("createQuestion", () => {
		test("create question with explanation", async () => {
			const question: QuestionData = {
				question: "question",
				explanation: "explanation",
				answers: [
					{
						text: "answer 1",
						isValidAnswer: true,
					},
					{
						text: "answer 2",
						isValidAnswer: true,
					},
					{
						text: "answer 3",
						isValidAnswer: true,
					},
					{
						text: "answer 4",
						isValidAnswer: true,
					},
				],
			};
			const createdQuestion = await createQuestion(question);
			expect(createdQuestion[0]).toBeInstanceOf(Question);
		});
		test("create question without explanation", async () => {
			const question = createSampleQuestion(false);
			const createdQuestion = await createQuestion(question);
			expect(createdQuestion[0]).toBeInstanceOf(Question);
		});
	});

	describe("getQuestionsCount", () => {
		test("should return 0 when database is empty", async () => {
			const questionsCount = await getQuestionsCount();
			expect(questionsCount).toBeNumber();
			expect(questionsCount).toBe(0);
		});

		test("should return correct count after creating questions", async () => {
			const question: QuestionData = {
				question: "question",
				explanation: "explanation",
				answers: [
					{
						text: "answer 1",
						isValidAnswer: true,
					},
					{
						text: "answer 2",
						isValidAnswer: true,
					},
					{
						text: "answer 3",
						isValidAnswer: true,
					},
					{
						text: "answer 4",
						isValidAnswer: true,
					},
				],
			};
			const question2: QuestionData = {
				question: "question",
				explanation: "explanation",
				answers: [
					{
						text: "answer 1",
						isValidAnswer: true,
					},
					{
						text: "answer 2",
						isValidAnswer: true,
					},
					{
						text: "answer 3",
						isValidAnswer: true,
					},
					{
						text: "answer 4",
						isValidAnswer: true,
					},
				],
			};
			const question3: QuestionData = {
				question: "question",
				explanation: "explanation",
				answers: [
					{
						text: "answer 1",
						isValidAnswer: true,
					},
					{
						text: "answer 2",
						isValidAnswer: true,
					},
					{
						text: "answer 3",
						isValidAnswer: true,
					},
					{
						text: "answer 4",
						isValidAnswer: true,
					},
				],
			};
			await createQuestion(question);
			await createQuestion(question2);
			await createQuestion(question3);
			const questionsCount = await getQuestionsCount();
			expect(questionsCount).toBeNumber();
			expect(questionsCount).toBe(3);
		});
	});

	describe("getRandomQuestion", () => {
		test("should returns null if no question found", async () => {
			expect(await getRandomQuestion()).toBeNull();
		});
		test("should returns random question when questions exist in database", async () => {
			await createQuestion(createSampleQuestion());
			expect(await getRandomQuestion()).toBeInstanceOf(Question);
		});
	});

	afterEach(async () => {
		await sequelize.close();
	});
});
