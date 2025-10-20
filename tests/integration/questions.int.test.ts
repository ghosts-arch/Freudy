import { Database } from "bun:sqlite";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "../../src/database/schema";
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
	let database: BunSQLiteDatabase<typeof schema>;
	let db: Database;
	beforeEach(async () => {
		db = new Database(":memory:");
		database = drizzle(db, { schema: schema });
		migrate(database, {
			migrationsFolder: "drizzle",
		});
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
			const createdQuestion = await createQuestion(database, question);
			expect(createdQuestion).toBeObject();
		});
		test("create question without explanation", async () => {
			const question = createSampleQuestion(false);
			const createdQuestion = await createQuestion(database, question);
			expect(createdQuestion).toBeObject();
		});
	});

	describe("getQuestionsCount", () => {
		test("should return 0 when database is empty", async () => {
			const questionsCount = await getQuestionsCount(database);
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
			await createQuestion(database, question);
			await createQuestion(database, question2);
			await createQuestion(database, question3);
			const questionsCount = await getQuestionsCount(database);
			expect(questionsCount).toBeNumber();
			expect(questionsCount).toBe(3);
		});
	});

	describe("getRandomQuestion", () => {
		test("should returns null if no question found", async () => {
			expect(await getRandomQuestion(database)).toBeNull();
		});
		test("should returns random question when questions exist in database", async () => {
			await createQuestion(database, createSampleQuestion());
			expect(await getRandomQuestion(database)).toBeObject();
		});
	});

	afterEach(async () => {
		db.close();
	});
});
