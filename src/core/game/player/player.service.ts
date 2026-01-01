import { isValidDiscordId } from "@/utils/checkDiscordId";
import type { PlayerRepository } from "./player.repository";

export class PlayerService {
	private declare userRepository: PlayerRepository;
	constructor(userRepository: PlayerRepository) {
		this.userRepository = userRepository;
	}

	initPlayer = (userId: string) => {
		if (!isValidDiscordId(userId)) throw new Error();
		this.userRepository.createUser(userId);
	};

	getPlayerCurrentPosition = async (userId: string): Promise<number> => {
		if (!isValidDiscordId(userId)) throw new Error();
		const user = await this.userRepository.getUser(userId);
		if (!user) throw new Error();
		return user.position;
	};

	updatePlayerPosition = async (userId: string, newPosition: number) => {
		if (!isValidDiscordId(userId)) throw new Error();
		await this.userRepository.updatePosition(userId, newPosition);
	};
}
