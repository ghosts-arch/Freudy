import { SlashCommandBuilder } from "discord.js";
import type { QuestionData } from "@/types";
import { processFileParsing } from "../core/services/fileService";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { ICommand } from "../types/commandInterface";

const uploadCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.ADMINISTRATOR,
	data: new SlashCommandBuilder()
		.setName("upload")
		.setDescription("commande pour upload des commands")
		.addAttachmentOption((option) =>
			option
				.setName("file")
				.setDescription("fichier csv a upload")
				.setRequired(true),
		),
	async execute(context, services) {
		await context.interaction.deferReply();
		const attachment = context.interaction.options.getAttachment("file", true);
		let questionsData: QuestionData[] = [];
		try {
			questionsData = await processFileParsing(attachment);
		} catch (error) {
			context.sendErrorEmbed(`${error}`);
		}
		for (const question of questionsData) {
			await services.questions.createQuestion(question);
		}
		context.interaction.editReply("questions rajoutées !");
	},
};

export default uploadCommand;
