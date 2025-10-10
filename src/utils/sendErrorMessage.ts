import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const sendErrorMessage = (
	interaction: ChatInputCommandInteraction,
	error: string,
) => {
	const ErrorEmbed = new EmbedBuilder()
		.setColor("Red")
		.setDescription(`Erreur : ${error}`);
	interaction.reply({ embeds: [ErrorEmbed] });
};
