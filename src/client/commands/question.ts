import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type { CommandInterface } from "../types/command";
import { Question, User } from "../database/database";
import type { CustomChatInputCommandInteraction } from "../types/customInteraction";
import { buildContainer } from "../ui/container";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

const questionCommand: CommandInterface = {
  permission_level: PERMISSIONS_LEVEL.USER,
  data: new SlashCommandBuilder()
    .setName("question")
    .setDescription("Question psy..."),
  hasCooldown: true,
  async execute(interaction: CustomChatInputCommandInteraction) {
    if (!interaction?.channel?.isSendable()) return;
    let container: ContainerBuilder | undefined;
    const question = await Question.getRandomQuestion();
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return;
    if (member.presence?.clientStatus?.mobile) {
      container = buildQuestionContainer(interaction, question, true);
    } else {
      container = buildQuestionContainer(interaction, question);
    }
    const response = await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
      withResponse: true,
    });
    let validAnwserId = question.answers?.findIndex(
      (answer) => answer.isValidAnswer
    );

    const collectorFilter = (i: any) => i.user.id === interaction.user.id;
    try {
      const userResponse =
        await response.resource?.message?.awaitMessageComponent({
          filter: collectorFilter,
          time: 60_000,
        });
      if (!userResponse) throw new Error("no userResponse");
      const userAnswerId = parseInt(userResponse.customId.split("_")[1], 10);
      if (isNaN(userAnswerId)) {
        throw new Error(
          `${userResponse.customId.split("_")[1]} is not an valid ID.`
        );
      }
      if (validAnwserId == userAnswerId) {
        let user = undefined;
        try {
          user = await User.findOne({
            where: {
              userId: interaction.user.id,
            },
          });
        } catch (err) {
          console.log(err);
        }
        if (!user) {
          user = await User.create({ userId: interaction.user.id });
        }
        const hasLevelUp = user.setExperience(10);
        if (hasLevelUp) {
          const newTitleUnlockedEmbed = new EmbedBuilder().setColor("Blue")
            .setDescription(`<@!${
            interaction.user.id
          }>, vous êtes maintenant ${user.getTitle()} !
            `);
          interaction.channel.send({ embeds: [newTitleUnlockedEmbed] });
        }
        const container = buildContainer({
          color: 0x7cfc8c,
          title: "## ✅ Bonne réponse !",
          description: `\n${question.question}\n\n▶️ ${question.explanation}`,
          footer: `Points de connaissance : ${user.experience} 🧠 *(+10 🧠)*`,
          thumbnailUrl: interaction.client.user.displayAvatarURL(),
        });
        await userResponse?.update({ components: [container] });
      } else {
        const container = buildContainer({
          color: 0xe57373,
          title: "## ❌ Mauvaise réponse !",
          description: `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId].text}`,
          footer: `▶️ ${question.explanation}`,
          thumbnailUrl: interaction.client.user.displayAvatarURL(),
        });
        await userResponse?.update({ components: [container] });
      }
    } catch {
      const container = buildContainer({
        color: 0xffb74d,
        title: ":confused:  Vous N'avez pas répondu a temps",
        description: `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId].text}`,
        footer: `▶️ ${question.explanation}`,
        thumbnailUrl: interaction.client.user.displayAvatarURL(),
      });
      await interaction.editReply({ components: [container] });
    }
  },
};

export default questionCommand;

const buildQuestionContainer = (
  interaction: CustomChatInputCommandInteraction,
  question: Question,
  mobileVersion: boolean = false
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
    let buttonLabel = mobileVersion ? `${index + 1}` : `${answer.text}`;
    const button = new ButtonBuilder()
      .setLabel(buttonLabel)
      .setCustomId(`answer_${index}`)
      .setStyle(ButtonStyle.Primary);
    responsesRow.addComponents(button);
  });
  container.addActionRowComponents(responsesRow);
  return container;
};
