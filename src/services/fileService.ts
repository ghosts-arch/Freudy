import path from "node:path";
import { Readable } from "node:stream";
import csv from "csv-parser";
import type { Attachment } from "discord.js";
import type { QuestionData } from "./questionsService";

const ACCEPTED_EXTENSIONS = [".csv", ".json"];

export const getFileExtension = (fileName: string): string => {
	return path.extname(fileName);
	// return fileName.split(".").pop() ?? null;
};

export const isAcceptedExtension = (fileExtension: string): boolean => {
	return ACCEPTED_EXTENSIONS.includes(fileExtension);
};

export const downloadFile = async (fileUrl: string): Promise<Response> => {
	return await fetch(fileUrl);
};

export const parseJson = async (
	response: Response,
): Promise<QuestionData[]> => {
	const data = (await response.json()) as QuestionData[];
	return data;
};

export const parseCSV = async (response: Response) => {
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
	return results;
};

export const processFileParsing = async (
	attachment: Attachment,
): Promise<QuestionData[]> => {
	const extension = getFileExtension(attachment.name);
	if (!extension)
		throw new Error("Impossible de déterminer l'extension de ce fichier");
	if (!isAcceptedExtension(extension))
		throw new Error("Cette extension de fichier n'est pas prise en charge");
	const response = await downloadFile(attachment.url);
	let questions: QuestionData[] = [];
	switch (extension) {
		case ".json":
			questions = await parseJson(response);
			break;
		case ".csv":
			questions = await parseCSV(response);
			break;
	}
	return questions;
};
