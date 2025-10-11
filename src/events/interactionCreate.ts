import {
	type CommandInteraction,
	EmbedBuilder,
	Events,
	type Interaction,
	MessageFlags,
} from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

import type { EventInterface } from "../types/event";
import { Cooldowns } from "../utils/cooldowns";

const InteractionCreate: EventInterface<Events.InteractionCreate> = {
	name: Events.InteractionCreate,
	once: false,
	execute: async (interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.channel?.isSendable()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return;
		if (
			command.hasCooldown &&
			interaction.client.cooldowns.findUser(interaction.user.id)
		) {
			return await sendErrorEmbed(
				interaction,
				`Vous pourrez rejouer dans ${Cooldowns.formatCooldown(
					interaction.client.cooldowns.getRemainingTimeFor(interaction.user.id),
				)}`,
			);
		}
		if (
			command.permission_level === PERMISSIONS_LEVEL.ADMINISTRATOR &&
			!interaction.memberPermissions?.has("Administrator")
		) {
			return await sendErrorEmbed(
				interaction,
				"Vous ne pouvez pas utiliser la commande suivante !",
			);
		}
		if (
			command.permission_level === PERMISSIONS_LEVEL.OWNER &&
			interaction.user.id !== "467818337599225866"
		) {
			return await sendErrorEmbed(
				interaction,
				"Vous ne pouvez pas utiliser cette commande !",
			);
		}
		try {
			command.execute(interaction);
			if (command.hasCooldown) {
				interaction.client.cooldowns.addUser(interaction.user.id, interaction);
			}
		} catch (err) {
			console.error(err);
		}
	},
};

export default InteractionCreate;

const sendErrorEmbed = async (
	interaction: CommandInteraction,
	error: string,
) => {
	const errorEmbed = new EmbedBuilder().setColor("Red").setDescription(error);
	await interaction.reply({
		embeds: [errorEmbed],
		flags: [MessageFlags.Ephemeral],
	});
};
