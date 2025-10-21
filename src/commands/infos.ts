import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import type { ApplicationServices, Context } from "@/types";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { ICommand } from "../types/commandInterface";

const infosCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.OWNER,
	data: new SlashCommandBuilder()
		.setName("infos")
		.setDescription("Infos about bot.")
		.setContexts(InteractionContextType.Guild),

	async execute(context: Context, services: ApplicationServices) {
		try {
			const questionsCount = await services.questions.getQuestionsCount();
			await context.reply(`Nombre de questions : ${questionsCount}.`);
		} catch (error) {
			await context.sendErrorEmbed(`${error}`);
			console.error(error);
		}
	},
};

export default infosCommand;
