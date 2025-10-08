import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

export interface CommandInterface {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	hasCooldown?: boolean;
	permission_level: PERMISSIONS_LEVEL;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
