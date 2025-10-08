import "discord.js";
import type { Cooldowns } from "../utils/cooldowns";

declare module "discord.js" {
	interface Client {
		cooldowns: Cooldowns;
		commands: Collection<string, CommandInterface>;
	}
}
