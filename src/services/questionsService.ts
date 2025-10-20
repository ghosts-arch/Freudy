import { sql } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import type * as schema from "../database/schema";
import { answers, questions } from "../database/schema";
import type { Question } from "../database/types";

export interface AnswerData {
	text: string;
	isValidAnswer: boolean;
}

export interface QuestionData {
	question: string;
	explanation?: string;
	answers: AnswerData[];
}

export const getQuestionsCount = async (
	db: BunSQLiteDatabase<typeof schema>,
): Promise<number> => {
	return await db.$count(questions);
};

export const getRandomQuestion = async (
	db: BunSQLiteDatabase<typeof schema>,
): Promise<Question | null> => {
	const question = await db.query.questions.findFirst({
		with: { answers: true },
		orderBy: sql`RANDOM()`,
	});
	if (!question) return null;
	return question;
};

export const createQuestion = async (
	database: BunSQLiteDatabase<typeof schema>,
	question: QuestionData,
): Promise<Question> => {
	const [insertedQuestion] = await database
		.insert(questions)
		.values({ question: question.question, explanation: question.explanation })
		.returning();
	if (!insertedQuestion) throw Error();
	await database.insert(answers).values(
		question.answers.map((answer) => ({
			text: answer.text,
			isValidAnswer: answer.isValidAnswer,
			questionId: insertedQuestion?.id,
		})),
	);
	return insertedQuestion;
};
