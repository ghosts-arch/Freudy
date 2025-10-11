import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";

import type { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

export interface CommandInterface {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	hasCooldown?: boolean;
	permission_level: PERMISSIONS_LEVEL;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
