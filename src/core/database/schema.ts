import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const questions = sqliteTable("questions", {
	id: int("id").primaryKey(),
	question: text("question").notNull(),
	explanation: text("explanation"),
});

export const questionsRelations = relations(questions, ({ many }) => ({
	answers: many(answers),
}));

export const answers = sqliteTable("answers", {
	id: int("id").primaryKey(),
	text: text("text").notNull(),
	isValidAnswer: int("is_valid_answer", { mode: "boolean" }).notNull(),
	questionId: int("question_id")
		.notNull()
		.references(() => questions.id, { onDelete: "cascade" }),
});

export const answersRelations = relations(answers, ({ one }) => ({
	question: one(questions, {
		fields: [answers.questionId],
		references: [questions.id],
	}),
}));

export const dailyFacts = sqliteTable("daily_fact", {
	id: int("id").primaryKey(),
	fact: text("fact").notNull(),
});

export const users = sqliteTable("users", {
	id: int("id").primaryKey(),
	userId: text("user_id").notNull(),
	level: int("level").notNull().default(0),
	experience: int("experience").notNull().default(0),
});
