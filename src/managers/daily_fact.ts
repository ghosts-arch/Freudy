import { GoogleGenAI } from "@google/genai";
import { EmbedBuilder } from "discord.js";
import { Sequelize } from "sequelize";
import type { Freudy } from "../client";
import { DailyFact } from "../database/database";
import { info } from "../utils/logging";

let interval: NodeJS.Timeout | null = null;
let timeout: NodeJS.Timeout | null = null;

const getDateInMilliseconds = () => {
	const date = new Date();
	return (
		date.getHours() * 3_600_000 +
		date.getMinutes() * 60_000 +
		date.getSeconds() * 1000 +
		date.getMilliseconds()
	);
};

const calculateDelay = () => {
	const now = getDateInMilliseconds();
	if (now < 32_400_000) {
		return 32_400_000 - now;
	} else {
		return 86_400_000 - now + 32_400_000;
	}
};

const callback = async (client: Freudy) => {
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_KEY,
	});

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents:
			"Sélectionne un signe du zodiaque aléatoire et génére un conseil très très aléatoire dans le domaine que tu veux (amour, santé, travail...). Génére une réponse au format {emote} {signe} - {sujet} \n {conseil}.",
		config: {
			systemInstruction:
				"Tu es freudy, un bot chargé de l'horoscope quotidien du serveur. Ton but est de donner des conseils très aproximatifs dans le domaine que tu veux (amour, santé, travail...), voir borderline.",
			thinkingConfig: {
				thinkingBudget: 0,
			},
		},
	});

	const channel = await client.channels.fetch(
		process.env.DAILY_FACT_CHANNEL_ID,
	);
	console.log(DailyFact);
	const fact = await DailyFact.findOne({
		order: Sequelize.literal("random()"),
	});
	if (!fact) return;
	if (channel?.isSendable()) {
		const description = `${fact.fact} \n ${response.text}`;
		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setDescription(description);
		channel.send({ embeds: [embed] });
	}
	await info("daily message sended with success !");
};

export const start = async (client: Freudy) => {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
		console.warn("clean old timeout");
	}
	if (interval) {
		clearInterval(interval);
		interval = null;
		console.warn("clean old interval");
	}

	await info("daily message manager starded !");
	const delay = calculateDelay();
	timeout = setTimeout(async () => {
		await callback(client);
		interval = setInterval(async () => await callback(client), 86_400_000);
	}, delay);
};
