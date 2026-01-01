import type { PlayerService } from "@/core/game/player/player.service";
import type { Question } from "@/types";
import type { QuestionService } from "./question/question.service";

export class GameService {
	constructor(
		private readonly playerService: PlayerService,
		private readonly questionService: QuestionService,
	) {
		this.playerService = playerService;
		this.questionService = questionService;
	}

	handlePlayerTurn = async (
		userId: string,
	): Promise<{
		diceRoll: number;
		playerNewPosition: number;
		question: Question;
	}> => {
		const diceRoll = Math.floor(Math.random() * 6 + 1);
		const playerPosition =
			await this.playerService.getPlayerCurrentPosition(userId);
		const playerNewPosition = ((playerPosition + diceRoll - 1) % 40) + 1;
		await this.playerService.updatePlayerPosition(userId, playerNewPosition);
		const question = await this.questionService.getQuestion();
		return {
			diceRoll,
			playerNewPosition,
			question,
		};
	};
}
