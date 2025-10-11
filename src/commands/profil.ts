import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { User } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { CommandInterface } from "../types/command";
import { sendErrorMessage } from "../utils/sendErrorMessage";

const questionCommand: CommandInterface = {
	permission_level: PERMISSIONS_LEVEL.USER,
	data: new SlashCommandBuilder()
		.setName("profil")
		.setDescription("Mon profil"),
	async execute(interaction: ChatInputCommandInteraction) {
		const user = await User.findOne({ where: { userId: interaction.user.id } });
		if (!user)
			return sendErrorMessage(
				interaction,
				"Vous n'avez pas encore commencer à étudier la voie de Freud !",
			);
		const profilEmbed = new EmbedBuilder().setColor("Blue").setDescription(`
        Vos points de connaissance : ${
					user.experience
				} 🧠\n\n Votre titre actuel : \`${user.getTitle()}\``);
		interaction.reply({ embeds: [profilEmbed] });
	},
};

export default questionCommand;
