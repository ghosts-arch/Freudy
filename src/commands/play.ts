import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type MessageComponentInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { PERMISSIONS_LEVEL } from "@/enums/permissionsLevel";
import type { ICommand } from "@/types/commandInterface";
import { info } from "@/utils/logging";
import { buildContainer } from "../ui/container";

const playCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.USER,
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play your turn"),
	// hasCooldown: true,
	async execute(context) {
		const { diceRoll, playerNewPosition, question } =
			await context.interaction.client.applicationServices.gameService.handlePlayerTurn(
				context.interaction.user.id,
			);

		const board =
			context.interaction.client.applicationServices.boardService.buildBoard(
				playerNewPosition,
			);
		console.log(0);

		const container = buildContainer({
			color: 0x9b8cff,
			title: `## Case *question* !`,
			description: `-# Vous avez avancer de ${diceRoll} cases\n\`\`\`\n${board.join("")}\`\`\`\n${question.question}`,
		});

		const responsesRow = new ActionRowBuilder<ButtonBuilder>();
		question.answers?.forEach((answer, index) => {
			const buttonLabel = `${answer.text}`;
			const button = new ButtonBuilder()
				.setLabel(buttonLabel)
				.setCustomId(`answer_${index}`)
				.setStyle(ButtonStyle.Primary);
			responsesRow.addComponents(button);
		});
		container.addActionRowComponents(responsesRow);

		console.log(container);

		const response = await context.interaction.reply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
			withResponse: true,
		});

		console.log(3);
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
				const container = buildContainer({
					color: 0x7cfc8c,
					title: "## ✅ Bonne réponse !",
					description: `\n${question.question}\n\n▶️ ${question.explanation}`,
				});
				await userResponse?.update({ components: [container] });
			} else {
				const container = buildContainer({
					color: 0xe57373,
					title: "## ❌ Mauvaise réponse !",
					description: `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId]?.text}`,
					footer: question.explanation ? `▶️ ${question.explanation}` : "",
				});
				await userResponse?.update({ components: [container] });
			}
		} catch {
			const container = buildContainer({
				color: 0xffb74d,
				title: ":confused:  Vous N'avez pas répondu a temps",
				description: `\n${question.question}\n\n La bonne réponse était : ${question.answers[validAnwserId]?.text}`,
				footer: question.explanation ? `▶️ ${question.explanation}` : "",
			});
			await context.interaction.editReply({ components: [container] });
		}
	},
};

export default playCommand;
