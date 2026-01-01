import type { Question } from "@/types";
import type { QuestionRepository } from "./question.repository";

export class QuestionService {
	constructor(private readonly questionReposiory: QuestionRepository) {
		this.questionReposiory = questionReposiory;
	}

	getQuestion = async (): Promise<Question> => {
		const question = await this.questionReposiory.getRandomQuestion();
		if (!question) throw Error();
		return question;
	};
}
