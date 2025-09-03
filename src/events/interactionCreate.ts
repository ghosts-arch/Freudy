import {
  Embed,
  EmbedBuilder,
  Events,
  Interaction,
  MessageFlags,
} from "discord.js";
import { EventInterface } from "../types/event";

import { CustomChatInputCommandInteraction } from "../types/customInteraction";
import { Cooldowns } from "../utils/cooldowns";

const InteractionCreate: EventInterface = {
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction: CustomChatInputCommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.channel?.isSendable()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    if (
      command.hasCooldown &&
      interaction.client.cooldowns.findUser(interaction.user.id)
    ) {
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `Vous pourrez rejouer dans ${Cooldowns.formatCooldown(
            interaction.client.cooldowns.getRemainingTimeFor(
              interaction.user.id
            )
          )}`
        );
      await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    try {
      command.execute(interaction);
      /* if (command.hasCooldown) {
        interaction.client.cooldowns.addUser(interaction.user.id, interaction);
      }*/
    } catch (err) {
      console.error(err);
    }
  },
};

export default InteractionCreate;
