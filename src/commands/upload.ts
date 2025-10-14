import { Readable } from "node:stream";
import csv from "csv-parser";
import { SlashCommandBuilder } from "discord.js";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";
import { createQuestion } from "../services/questionsService";
import type { ICommand } from "./commandInterface";

const ACCEPTED_EXTENSIONS = ["csv", "json"];

const uploadCommand: ICommand = {
	permissionLevel: PERMISSIONS_LEVEL.ADMINISTRATOR,
	data: new SlashCommandBuilder()
		.setName("upload")
		.setDescription("commande pour upload des commands")
		.addAttachmentOption((option) =>
			option
				.setName("file")
				.setDescription("fichier csv a upload")
				.setRequired(true),
		),
	async execute(context) {
		await context.interaction.deferReply();
		const attachment = context.interaction.options.getAttachment("file", true);
		const fileExtension = attachment.name.split(".")[1];
		if (!fileExtension) return; // TODO: error , unknown extension
		if (!ACCEPTED_EXTENSIONS.includes(fileExtension)) {
			context.interaction.editReply(
				"Extension de fichier inconnue, veuillez recommencer !",
			);
			return;
		}
		const result = await fetch(attachment.url);
		switch (fileExtension) {
			case "csv":
				await parseFile(result);
				break;
			case "json": {
				console.log(result);
				const data = await result.json();
				for (const question of data) {
					await createQuestion(question);
				}
				break;
			}
			default:
				break;
		}
		context.interaction.editReply("questions rajoutées !");
	},
};

export default uploadCommand;

const parseFile = async (response: Response) => {
	const buffer = await response.arrayBuffer();
	const text = Buffer.from(buffer).toString("utf-8");
	const stream = Readable.from(text);
	const results: {
		question: string;
		answers: { text: string; isValidAnswer: boolean }[];
	}[] = [];
	await new Promise<void>((resolve, reject) => {
		stream.pipe(
			csv({
				separator: ";",
				skipLines: 7,
				headers: [
					"id",
					"Question - max 120 characters",
					"Answer 1 - max 75 characters",
					"Answer 2 - max 75 characters",
					"Answer 3 - max 75 characters",
					"Answer 4 - max 75 characters",
					"Time limit (sec) – 5, 10, 20, 30, 60, 90, 120, or 240 secs",
					"Correct answer(s) - choose at least one",
				],
			})
				.on("headers", (headers) => {
					console.log(headers);
				})
				.on("data", (data) => {
					if (data["Question - max 120 characters"] === "" || data.id === "")
						return;
					const question = {
						question: data["Question - max 120 characters"],
						answers: [
							{
								text: data["Answer 1 - max 75 characters"],
								isValidAnswer: true,
							},
							{
								text: data["Answer 2 - max 75 characters"],
								isValidAnswer: false,
							},
							{
								text: data["Answer 3 - max 75 characters"],
								isValidAnswer: false,
							},
							{
								text: data["Answer 4 - max 75 characters"],
								isValidAnswer: false,
							},
						],
					};
					results.push(question);
				})
				.on("end", () => {
					resolve();
				})
				.on("error", reject),
		);
	});
	for (const question of results) {
		await createQuestion(question);
	}
	return;
};
