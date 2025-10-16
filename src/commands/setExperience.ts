import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import {
	createUser,
	getUser,
	setExperience as setUserExperience,
} from "../services/userService";
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
	async execute(context) {
		const amount = context.interaction.options.getInteger("amount", true);
		const targetUser = context.interaction.options.getUser("user", true);
		let user = await getUser(targetUser.id);
		if (!user) {
			user = await createUser(targetUser.id);
		}
		setUserExperience(user, 10);
		context.reply(`${amount} experience given to ${targetUser.username} ! ✅`);
	},
};

export default setExperience;
