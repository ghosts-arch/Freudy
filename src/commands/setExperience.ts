import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import {
	createUser,
	getUser,
	setExperience as setUserExperience,
} from "../services/userService";
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
		let user = await getUser(targetUser.id);
		if (!user) {
			user = await createUser(targetUser.id);
		}
		setUserExperience(user, 10);
		interaction.reply(
			`${amount} experience given to ${targetUser.username} ! ✅`,
		);
	},
};

export default setExperience;
