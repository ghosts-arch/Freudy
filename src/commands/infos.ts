import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { Question } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { CommandInterface } from "../types/command";

const infosCommand: CommandInterface = {
	permission_level: PERMISSIONS_LEVEL.OWNER,
	data: new SlashCommandBuilder()
		.setName("infos")
		.setDescription("Infos about bot.")
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) {
		const questionsCount = await Question.count();
		interaction.reply(`Nombre de questions : ${questionsCount}.`);
	},
};

export default infosCommand;
