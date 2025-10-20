import { SlashCommandBuilder } from "discord.js";
import type { QuestionData } from "@/types";
import { db } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import { processFileParsing } from "../services/fileService";
import { createQuestion } from "../services/questionsService";
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
	async execute(context) {
		await context.interaction.deferReply();
		const attachment = context.interaction.options.getAttachment("file", true);
		let questionsData: QuestionData[] = [];
		try {
			questionsData = await processFileParsing(attachment);
		} catch (error) {
			context.sendErrorEmbed(`${error}`);
		}
		for (const question of questionsData) {
			await createQuestion(db, question);
		}
		context.interaction.editReply("questions rajoutées !");
	},
};

export default uploadCommand;
