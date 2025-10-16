import {
	type ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
} from "discord.js";

export class Context {
	declare interaction: ChatInputCommandInteraction;

	constructor(interaction: ChatInputCommandInteraction) {
		this.interaction = interaction;
	}

	send = (description: string) => {
		const sendedEmbed = new EmbedBuilder()
			.setColor("Blue")
			.setDescription(description);
		this.interaction.reply({ embeds: [sendedEmbed] });
	};

	reply = (description: string) => {
		const replyEmbed = new EmbedBuilder()
			.setColor("Blue")
			.setDescription(description);
		this.interaction.reply({ embeds: [replyEmbed] });
	};

	sendErrorEmbed = async (error: string) => {
		const errorEmbed = new EmbedBuilder().setColor("Red").setDescription(error);
		await this.interaction.reply({
			embeds: [errorEmbed],
			flags: [MessageFlags.Ephemeral],
		});
	};
}
