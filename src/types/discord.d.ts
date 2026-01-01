import "discord.js";
import type { Cooldowns } from "../utils/cooldowns";
import type { ApplicationServices } from "@/core/application.services";

declare module "discord.js" {
	interface Client {
		cooldowns: Cooldowns;
		commands: Collection<string, CommandInterface>;
		applicationServices: ApplicationServices;
	}
}
