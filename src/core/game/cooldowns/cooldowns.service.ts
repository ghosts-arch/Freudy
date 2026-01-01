import { Collection } from "discord.js";

export type CooldownConfig = {
	duration: number;
};

export class CooldownService {
	private declare cooldowns: Collection<string, number>;
	constructor(private config: CooldownConfig) {
		this.cooldowns = new Collection<string, number>();
		this.config = config;
	}

	addUser = (userId: string, callback: () => void): void => {
		this.cooldowns.set(userId, Date.now());
		setTimeout(() => {
			this.cooldowns.delete(userId);
			callback();
		}, this.config.duration);
	};

	findUser = (userId: string): boolean => {
		return this.cooldowns.has(userId);
	};

	getRemainingTimeFor = (userId: string): number => {
		const userRemaningCooldown = this.cooldowns.get(userId);
		if (!userRemaningCooldown) {
			throw Error();
		}
		const now = Date.now();
		const timeSinceLastUsage = now - userRemaningCooldown;
		return this.config.duration - timeSinceLastUsage;
	};

	static formatCooldown = (cooldown: number): string => {
		return `${Math.floor(cooldown / 3_600_000)} heure(s) ${Math.floor(
			(cooldown % 3_600_000) / 60_000,
		)} minute(s) ${Math.floor((cooldown % 60_000) / 1_000)} seconde(s)`;
	};
}
