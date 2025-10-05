import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../types/command";

import { CustomChatInputCommandInteraction } from "../types/customInteraction";
import { User } from "../database/database";

const questionCommand: CommandInterface = {
  isAdministratorCommand: false,
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Mon profil"),
  async execute(interaction: CustomChatInputCommandInteraction) {
    const user = await User.findOne({ where: { userId: interaction.user.id } });
    if (!user) {
      const noProfilEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "Vous n'avez pas encore commencer à étudier la voie de Freud !"
        );
      interaction.reply({ embeds: [noProfilEmbed] });
    } else {
      const profilEmbed = new EmbedBuilder().setColor("Blue").setDescription(`
        Vos points de connaissance : ${
          user.experience
        } 🧠\n\n Votre titre actuel : \`${user.getTitle()}\``);
      interaction.reply({ embeds: [profilEmbed] });
    }
  },
};

export default questionCommand;
