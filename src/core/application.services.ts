import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type * as schema from "@/core/database/schema";
import { BoardService } from "./game/board/board.service";
import {
	type CooldownConfig,
	CooldownService,
} from "./game/cooldowns/cooldowns.service";
import { GameService } from "./game/game.service";
import { PlayerRepository } from "./game/player/player.repository";
import { PlayerService } from "./game/player/player.service";
import { QuestionRepository } from "./game/question/question.repository";
import { QuestionService } from "./game/question/question.service";

export class ApplicationServices {
	private readonly playerRepository: PlayerRepository;
	private readonly questionRepository: QuestionRepository;

	public readonly playerService: PlayerService;
	public readonly questionService: QuestionService;
	public readonly gameService: GameService;
	public readonly boardService: BoardService;
	public readonly cooldownsService: CooldownService;
	constructor(
		database: BunSQLiteDatabase<typeof schema>,
		cooldownsConfig: CooldownConfig,
	) {
		this.cooldownsService = new CooldownService(cooldownsConfig);
		this.playerRepository = new PlayerRepository(database);
		this.questionRepository = new QuestionRepository(database);
		this.boardService = new BoardService();
		this.playerService = new PlayerService(this.playerRepository);
		this.questionService = new QuestionService(this.questionRepository);
		this.gameService = new GameService(
			this.playerService,
			this.questionService,
		);
	}
}
