import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	type ContainerBuilder,
	type MessageComponentInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import type { QuestionWithAnswers } from "@/types";
import { db } from "../database/database";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import {
	getTitle,
	processLevelProgression,
} from "../services/experienceService";
import { getRandomQuestion } from "../services/questionsService";
import { UserService } from "../services/userService";
import type { ICommand } from "../types/commandInterface";
import { buildContainer } from "../ui/container";
import { info } from "../utils/logging";

const questionCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.USER,
	data: new SlashCommandBuilder()
		.setName("question")
		.setDescription("Question psy..."),
	hasCooldown: true,
	async execute(context) {
		const userService = new UserService(db);
		let container: ContainerBuilder | undefined;
		const question = await getRandomQuestion(db);
		if (!question) return;
		info(`${context.interaction.user.id} get question with id ${question.id}`);
		const member = await context.interaction.guild?.members.fetch(
			context.interaction.user.id,
		);
		if (!member) return;
		if (member.presence?.clientStatus?.mobile) {
			container = buildQuestionContainer(context.interaction, question, true);
		} else {
			container = buildQuestionContainer(context.interaction, question);
		}
		const response = await context.interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true,
		});
		const validAnwserId = question.answers.findIndex(
			(answer) => answer.isValidAnswer,
		);
		const collectorFilter = (i: MessageComponentInteraction) =>
			i.user.id === context.interaction.user.id;
		try {
			const userResponse =
				await response.resource?.message?.awaitMessageComponent({
					filter: collectorFilter,
					time: 60_000,
				});
			if (!userResponse) throw new Error("no userResponse");
			const userAnswerId = parseInt(userResponse.customId.split("_")[1], 10);
			if (Number.isNaN(userAnswerId)) {
				throw new Error(
					`${userResponse.customId.split("_")[1]} is not an valid ID.`,
				);
			}
			info(
				`${context.interaction.user.id} replied answer with id ${userAnswerId}`,
			);
			if (validAnwserId === userAnswerId) {
				let user = await userService.getUser(context.interaction.user.id);
				if (!user) {
					user = await userService.createUser(context.interaction.user.id);
				}
				const hasLevelUp = await processLevelProgression(db, user.userId);
				if (hasLevelUp) {
					context.send(`<@!${
						context.interaction.user.id
					}>, vous êtes maintenant ${getTitle(user.level)} !
            `);
				}
				const container = buildContainer({
					color: 0x7cfc8c,
					title: "## ✅ Bonne réponse !",
					description: `\n${question.question}\n\n▶️ ${question.explanation}`,
					footer: `Points de connaissance : ${user.experience} 🧠 *(+10 🧠)*`,
					thumbnailUrl: context.interaction.client.user.displayAvatarURL(),
				});
				await userResponse?.update({ components: [container] });
			} else {
				const container = buildContainer({
					color: 0xe57373,
					title: "## ❌ Mauvaise réponse !",
					description: `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId]?.text}`,
					footer: question.explanation ? `▶️ ${question.explanation}` : "",
					thumbnailUrl: context.interaction.client.user.displayAvatarURL(),
				});
				await userResponse?.update({ components: [container] });
			}
		} catch {
			const container = buildContainer({
				color: 0xffb74d,
				title: ":confused:  Vous N'avez pas répondu a temps",
				description: `\n${question.question}\n\n La bonne réponse était : ${question.answers[validAnwserId]?.text}`,
				footer: question.explanation ? `▶️ ${question.explanation}` : "",
				thumbnailUrl: context.interaction.client.user.displayAvatarURL(),
			});
			await context.interaction.editReply({ components: [container] });
		}
	},
};

export default questionCommand;

const buildQuestionContainer = (
	interaction: ChatInputCommandInteraction,
	question: QuestionWithAnswers,
	mobileVersion: boolean = false,
): ContainerBuilder => {
	let description: string | undefined;
	if (mobileVersion) {
		description = question.answers
			?.map((answer, index) => `${index + 1}. ${answer.text}`)
			.join("\n");
	}
	const container = buildContainer({
		color: 0x9b8cff,
		title: `## ${question.question}`,
		description: description,
		thumbnailUrl: interaction.client.user.displayAvatarURL(),
	});
	const responsesRow = new ActionRowBuilder<ButtonBuilder>();
	question.answers?.forEach((answer, index) => {
		const buttonLabel = mobileVersion ? `${index + 1}` : `${answer.text}`;
		const button = new ButtonBuilder()
			.setLabel(buttonLabel)
			.setCustomId(`answer_${index}`)
			.setStyle(ButtonStyle.Primary);
		responsesRow.addComponents(button);
	});
	container.addActionRowComponents(responsesRow);
	return container;
};
