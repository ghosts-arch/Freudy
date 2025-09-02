import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import { CommandInterface } from "../types/command";
import { Question } from "../database/database";
import { CustomChatInputCommandInteraction } from "../types/customInteraction";

const questionCommand: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName("question")
    .setDescription("Question psy..."),
  async execute(interaction: CustomChatInputCommandInteraction) {
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
      (answer) => answer.isCorrectAnswer
    );
    if (!validAnwserId) return;
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
        console.info("bonne reponse");
        const validTitle = new TextDisplayBuilder().setContent(
          "## ✅ Bonne réponse !"
        );
        const questionReminder = new TextDisplayBuilder().setContent(
          `\n${question.question}`
        );
        const validContainer = new ContainerBuilder().setAccentColor(0x7cfc8c);
        const validSection = new SectionBuilder()
          .setThumbnailAccessory(
            new ThumbnailBuilder({
              media: {
                url: interaction.client.user.displayAvatarURL(),
              },
            })
          )
          .addTextDisplayComponents(validTitle)
          .addTextDisplayComponents(questionReminder);

        validContainer
          .addSectionComponents(validSection)
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `▶️ ${question.answers?.[validAnwserId].explanation}`
            )
          );
        await userResponse?.update({ components: [validContainer] });
      } else {
        console.info("mauvaise reponse");
        const wrongTitle = new TextDisplayBuilder().setContent(
          "## ❌ Mauvaise réponse !"
        );
        const questionReminder = new TextDisplayBuilder().setContent(
          `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId].text}`
        );
        const wrongContainer = new ContainerBuilder().setAccentColor(0xe57373);
        const wrongSection = new SectionBuilder()
          .setThumbnailAccessory(
            new ThumbnailBuilder({
              media: {
                url: interaction.client.user.displayAvatarURL(),
              },
            })
          )
          .addTextDisplayComponents(wrongTitle)
          .addTextDisplayComponents(questionReminder);

        wrongContainer
          .addSectionComponents(wrongSection)
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `▶️ ${question.answers?.[validAnwserId].explanation}`
            )
          );
        await userResponse?.update({ components: [wrongContainer] });
      }
    } catch {
      const noResponseContainer = new ContainerBuilder().setAccentColor(
        0xffb74d
      );
      const noResponseTitle = new TextDisplayBuilder().setContent(
        ":confused:  Vous N'avez pas répondu a temps"
      );
      const questionReminder = new TextDisplayBuilder().setContent(
        `\n${question.question}\n\n La bonne réponse était : ${question.answers?.[validAnwserId].text}`
      );
      const noResponseSection = new SectionBuilder()
        .setThumbnailAccessory(
          new ThumbnailBuilder({
            media: {
              url: interaction.client.user.displayAvatarURL(),
            },
          })
        )
        .addTextDisplayComponents([noResponseTitle, questionReminder]);

      noResponseContainer
        .addSectionComponents(noResponseSection)
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `▶️ ${question.answers?.[validAnwserId].explanation}`
          )
        );

      await interaction.editReply({ components: [noResponseContainer] });
    }
  },
};

export default questionCommand;

const buildQuestionContainer = (
  interaction: CustomChatInputCommandInteraction,
  question: Question,
  mobileVersion: boolean = false
): ContainerBuilder => {
  const container = new ContainerBuilder().setAccentColor(0x9b8cff);

  const section = new SectionBuilder()
    .setThumbnailAccessory(
      new ThumbnailBuilder({
        media: {
          url: interaction.client.user.displayAvatarURL(),
        },
      })
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${question.question}`)
    );

  const responsesRow = new ActionRowBuilder<ButtonBuilder>();

  if (mobileVersion) {
    section.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        question.answers
          ?.map((answer, index) => `${index + 1}. ${answer.text}`)
          .join("\n")
      )
    );
  }
  question.answers?.forEach((answer, index) => {
    let buttonLabel: string | undefined;
    if (mobileVersion) {
      buttonLabel = `${index + 1}`;
    } else {
      buttonLabel = `${answer.text}`;
    }
    const button = new ButtonBuilder()
      .setLabel(buttonLabel)
      .setCustomId(`answer_${index}`)
      .setStyle(ButtonStyle.Primary);
    responsesRow.addComponents(button);
  });
  container
    .addSectionComponents(section)
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
    )
    .addActionRowComponents(responsesRow);
  return container;
};
