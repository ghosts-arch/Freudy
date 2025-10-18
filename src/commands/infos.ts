import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import { getQuestionsCount } from "../services/questionsService";
import type { ICommand } from "../types/commandInterface";

const infosCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.OWNER,
	data: new SlashCommandBuilder()
		.setName("infos")
		.setDescription("Infos about bot.")
		.setContexts(InteractionContextType.Guild),

	async execute(context) {
		const questionsCount = await getQuestionsCount();
		context.reply(`Nombre de questions : ${questionsCount}.`);
	},
};

export default infosCommand;
