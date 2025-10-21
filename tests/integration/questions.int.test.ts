import { Database, SQLiteError } from "bun:sqlite";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { type BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import type { QuestionData } from "@/types";
import * as schema from "../../src/core/database/schema";
import { QuestionsService } from "../../src/core/services/questionsService";

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

describe("QuestionsService", () => {
	let database: BunSQLiteDatabase<typeof schema>;
	let db: Database;
	let questionsService: QuestionsService;
	beforeEach(async () => {
		db = new Database(":memory:");
		database = drizzle(db, { schema: schema });
		migrate(database, {
			migrationsFolder: "drizzle",
		});
		questionsService = new QuestionsService(database);
	});

	describe("test constraints", () => {
		test("pass null question should raise NOT NULL constraint error", async () => {
			try {
				await database
					.insert(schema.questions)
					//@ts-expect-error
					.values({ question: null })
					.returning();
				throw new Error(
					"ERROR : NOT NULL constraint on questions.question was violated",
				);
			} catch (error) {
				if ((error as Error).message.startsWith("ERROR :")) throw error;
				expect(error).toBeInstanceOf(SQLiteError);
				expect((error as Error).message).toContain(
					"NOT NULL constraint failed: questions.question",
				);
			}
		});
		test("pass null text should raise NOT NULL constraint error", async () => {
			try {
				await database
					.insert(schema.answers)
					//@ts-expect-error
					.values({ text: null })
					.returning();
				throw new Error(
					"ERROR : NOT NULL constraint on answers.text was violated",
				);
			} catch (error) {
				if ((error as Error).message.startsWith("ERROR :")) throw error;
				expect(error).toBeInstanceOf(SQLiteError);
				expect((error as Error).message).toContain(
					"NOT NULL constraint failed: answers.text",
				);
			}
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
			const createdQuestion = await questionsService.createQuestion(question);
			expect(createdQuestion).toBeObject();
		});
		test("create question without explanation", async () => {
			const question = createSampleQuestion(false);
			const createdQuestion = await questionsService.createQuestion(question);
			expect(createdQuestion).toBeObject();
		});
	});

	describe("getQuestionsCount", () => {
		test("should return 0 when database is empty", async () => {
			const questionsCount = await questionsService.getQuestionsCount();
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
			await questionsService.createQuestion(question);
			await questionsService.createQuestion(question2);
			await questionsService.createQuestion(question3);
			const questionsCount = await questionsService.getQuestionsCount();
			expect(questionsCount).toBeNumber();
			expect(questionsCount).toBe(3);
		});
	});

	describe("getRandomQuestion", () => {
		test("should returns null if no question found", async () => {
			expect(await questionsService.getRandomQuestion()).toBeNull();
		});
		test("should returns random question when questions exist in database", async () => {
			await questionsService.createQuestion(createSampleQuestion());
			expect(await questionsService.getRandomQuestion()).toBeObject();
		});
	});

	afterEach(async () => {
		db.close();
	});
});
