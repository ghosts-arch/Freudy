import { Events, type Interaction } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import { Context } from "../types/context";
import type { EventInterface } from "../types/event";
import { Cooldowns } from "../utils/cooldowns";

const InteractionCreate: EventInterface<Events.InteractionCreate> = {
	name: Events.InteractionCreate,
	once: false,
	execute: async (interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.channel?.isSendable()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		const context = new Context(interaction);
		if (!command) return;
		if (
			command.hasCooldown &&
			interaction.client.cooldowns.findUser(interaction.user.id)
		) {
			return await context.sendErrorEmbed(
				`Vous pourrez rejouer dans ${Cooldowns.formatCooldown(
					interaction.client.cooldowns.getRemainingTimeFor(interaction.user.id),
				)}`,
			);
		}
		if (
			command.permission_level === PERMISSIONS_LEVEL.ADMINISTRATOR &&
			!interaction.memberPermissions?.has("Administrator")
		) {
			return await context.sendErrorEmbed(
				"Vous ne pouvez pas utiliser la commande suivante !",
			);
		}
		if (
			command.permission_level === PERMISSIONS_LEVEL.OWNER &&
			interaction.user.id !== "467818337599225866"
		) {
			return await context.sendErrorEmbed(
				"Vous ne pouvez pas utiliser cette commande !",
			);
		}
		try {
			command.execute(context);
			if (command.hasCooldown) {
				interaction.client.cooldowns.addUser(interaction.user.id, () => {
					context.send(
						`<@!${interaction.user.id}>, vous pouvez a nouveau jouer !`,
					);
				});
			}
		} catch (err) {
			console.error(err);
		}
	},
};

export default InteractionCreate;
