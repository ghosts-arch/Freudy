import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type * as schema from "@/database/schema";

export interface AnswerData {
	text: string;
	isValidAnswer: boolean;
}

export interface QuestionData {
	question: string;
	explanation?: string;
	answers: AnswerData[];
}

export type User = InferSelectModel<typeof schema.users>;

export type Question = InferSelectModel<typeof schema.questions> & {
	answers: InferSelectModel<typeof schema.answers>[];
};

export type InsertedQuestion = InferInsertModel<typeof schema.questions>;
