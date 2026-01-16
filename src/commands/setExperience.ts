import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import type { ICommand } from "../types/commandInterface";

const setExperience: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.OWNER,
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
	async execute(context, services) {
		const amount = context.interaction.options.getInteger("amount", true);
		const targetUser = context.interaction.options.getUser("user", true);
		let user = await services.users.getUser(targetUser.id);
		if (!user) {
			user = await services.users.createUser(targetUser.id);
		}
		services.users.setExperience(targetUser.id, 10);
		await context.reply(
			`${amount} experience given to ${targetUser.username} ! ✅`,
		);
	},
};

export default setExperience;
