import { GoogleGenAI } from "@google/genai";

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

console.log(response.text);
