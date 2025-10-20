import { SlashCommandBuilder } from "discord.js";
import { db } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import { getTitle } from "../services/experienceService";
import { UserService } from "../services/userService";
import type { ICommand } from "../types/commandInterface";

const questionCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.USER,
	data: new SlashCommandBuilder()
		.setName("profil")
		.setDescription("Mon profil"),
	async execute(context) {
		const user = await new UserService(db).getUser(context.interaction.user.id);
		if (!user)
			return context.sendErrorEmbed(
				"Vous n'avez pas encore commencer à étudier la voie de Freud !",
			);
		context.reply(
			`Vos points de connaissance : ${
				user.experience
			} 🧠\n\n Votre titre actuel : \`${getTitle(user.level)}\``,
		);
	},
};

export default questionCommand;
