import { Sequelize } from "sequelize";
import { Answer } from "../database/models/answer";
import { Question } from "../database/models/question";

export interface AnswerData {
	text: string;
	isValidAnswer: boolean;
}

export interface QuestionData {
	question: string;
	explanation?: string;
	answers: AnswerData[];
}

export const getQuestionsCount = async (): Promise<number> => {
	return await Question.count();
};

export const getRandomQuestion = async (): Promise<Question | null> => {
	return await Question.findOne({
		order: Sequelize.literal("random()"),
		include: [
			{
				model: Answer,
				as: "answers",
			},
		],
	});
};

export const createQuestion = async (
	question: QuestionData,
): Promise<[Question, boolean | null]> => {
	const insertedQuestion = await Question.upsert({
		question: question.question,
		explanation: question.explanation,
	});
	for (const answer of question.answers) {
		await Answer.upsert({
			text: answer.text,
			isValidAnswer: answer.isValidAnswer,
			questionId: insertedQuestion[0].id,
		});
	}
	return insertedQuestion;
};
