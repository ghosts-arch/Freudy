import { Sequelize } from "sequelize";
import { Answer } from "../database/models/answer";
import { Question } from "../database/models/question";

export const getQuestionsCount = async (): Promise<number> => {
	return await Question.count();
};

export const getRandomQuestion = async (): Promise<Question> => {
	const question = await Question.findOne({
		order: Sequelize.literal("random()"),
		include: [
			{
				model: Answer,
				as: "answers",
			},
		],
	});
	if (!question) {
		throw new Error("No questions found in database.");
	}
	return question;
};
