import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { User } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { CommandInterface } from "../types/command";

const setExperience: CommandInterface = {
	permission_level: PERMISSIONS_LEVEL.OWNER,
	data: new SlashCommandBuilder()
		.setName("setexperience")
		.setDescription("Set experience of targeted user.")
		.setContexts(InteractionContextType.Guild)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("set experience of ...")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("new experience of user")
				.setRequired(true),
		),
	async execute(interaction) {
		const amount = interaction.options.getInteger("amount", true);
		const targetUser = interaction.options.getUser("user", true);
		let user = await User.findOne({ where: { userId: targetUser.id } });
		if (!user) {
			user = await User.create({ userId: targetUser.id });
		}
		user.experience = amount;
		await user.save();
		interaction.reply(
			`${amount} experience given to ${targetUser.username} ! ✅`,
		);
	},
};

export default setExperience;
