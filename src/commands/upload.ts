import { SlashCommandBuilder } from "discord.js";
import { CommandInterface } from "../types/command";
import { CustomChatInputCommandInteraction } from "../types/customInteraction";
import { Question, Answer } from "../database/database";

const ACCEPTED_EXTENSIONS = ["csv", "json"];
const uploadCommand: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("commande pour upload des commands")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("fichier csv a upload")
        .setRequired(true)
    ),
  async execute(interaction: CustomChatInputCommandInteraction) {
    await interaction.deferReply();
    const file = interaction.options.get("file");
    if (!file) {
      console.error("no file");
      return;
    }
    if (!file.attachment) return;
    const fileExtension = file.attachment.name.split(".")[1];
    if (!fileExtension) return; // TODO: error , unknown extension
    if (!ACCEPTED_EXTENSIONS.includes(fileExtension)) {
      interaction.editReply(
        "Extension de fichier inconnue, veuillez recommencer !"
      );
    }
    switch (fileExtension) {
      case "csv":
        break;
      case "json":
        const result = await fetch(file.attachment?.url);
        console.log(result);
        const data = await result.json();
        for (const question of data) {
          const validAnswer =
            question.answers[
              question.answers.findIndex(
                (answer: { text: string; isValidAnswer: boolean }) =>
                  answer.isValidAnswer === true
              )
            ];
          const insertedQuestion = await Question.upsert({
            question: question.question,
            explanation: question.explanation,
          });
          for (const answer of question.answers) {
            await Answer.upsert({
              text: answer.text,
              isValidAnswer: answer.isValidAnswer,
              questionId: insertedQuestion[0].id,
            });
          }
        }
        break;
      default:
        break;
    }
    interaction.editReply("questions rajoutées !");
  },
};

export default uploadCommand;
