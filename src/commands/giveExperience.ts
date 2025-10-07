import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import type { CommandInterface } from "../types/command";
import { User } from "../database/database";
import type { CustomChatInputCommandInteraction } from "../types/customInteraction";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

const giveExperienceCommand: CommandInterface = {
  permission_level: PERMISSIONS_LEVEL.OWNER,
  data: new SlashCommandBuilder()
    .setName("addexperience")
    .setDescription("Add experience to targeted user.")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Give experience to ...")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of experience to give...")
        .setRequired(true)
    ),
  async execute(interaction: CustomChatInputCommandInteraction) {
    const amount = interaction.options.getInteger("amount", true);
    const targetUser = interaction.options.getUser("user", true);
    let user;
    user = await User.findOne({
      where: { userId: targetUser.id },
    });
    if (!user) {
      user = await User.create({ userId: targetUser.id });
    }
    user.setExperience(amount);
    await user.save();
    interaction.reply(
      `${amount} experience given to ${targetUser.username} ! ✅`
    );
  },
};

export default giveExperienceCommand;
