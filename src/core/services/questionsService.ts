import { sql } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { InsertedQuestion, Question, QuestionData } from "@/types";
import type * as schema from "../database/schema";
import { answers, questions } from "../database/schema";

export class QuestionsService {
	constructor(private database: BunSQLiteDatabase<typeof schema>) {}

	getQuestionsCount = async (): Promise<number> => {
		return await this.database.$count(questions);
	};

	getRandomQuestion = async (): Promise<Question | null> => {
		const question = await this.database.query.questions.findFirst({
			with: { answers: true },
			orderBy: sql`RANDOM()`,
		});
		if (!question) return null;
		return question;
	};

	createQuestion = async (
		question: QuestionData,
	): Promise<InsertedQuestion> => {
		const insertedQuestion = this.database.transaction(async (transaction) => {
			const [insertedQuestion] = await transaction
				.insert(questions)
				.values({
					question: question.question,
					explanation: question.explanation,
				})
				.returning();
			if (!insertedQuestion) {
				transaction.rollback();
				throw new Error();
			}
			await transaction.insert(answers).values(
				question.answers.map((answer) => ({
					text: answer.text,
					isValidAnswer: answer.isValidAnswer,
					questionId: insertedQuestion?.id,
				})),
			);
			return insertedQuestion;
		});

		return insertedQuestion;
	};
}
