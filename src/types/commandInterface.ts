import type {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { Context } from "./context";

export interface ICommand {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	hasCooldown?: true;
	permissionLevel: PERMISSIONS_LEVEL;
	execute: (interation: Context) => Promise<void>;
}
