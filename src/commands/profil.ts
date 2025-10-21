import { SlashCommandBuilder } from "discord.js";
import type { ApplicationServices, Context } from "@/types";
import { getTitle } from "../core/services/experienceService";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { ICommand } from "../types/commandInterface";

const questionCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.USER,
	data: new SlashCommandBuilder()
		.setName("profil")
		.setDescription("Mon profil"),
	async execute(context: Context, services: ApplicationServices) {
		try {
			const user = await services.users.getUser(context.interaction.user.id);
			if (!user)
				return await context.sendErrorEmbed(
					"Vous n'avez pas encore commencer à étudier la voie de Freud !",
				);
			await context.reply(
				`Vos points de connaissance : ${
					user.experience
				} 🧠\n\n Votre titre actuel : \`${getTitle(user.level)}\``,
			);
		} catch (error) {
			await context.sendErrorEmbed(`${error}`);
			console.error(error);
		}
	},
};

export default questionCommand;
