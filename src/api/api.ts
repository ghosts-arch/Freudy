import express from "express";
import { DailyFact, Question } from "../database/database";

export const APP = express();

APP.get("/", (request, result) => {
  result.send({ message: "Pong !" });
});

APP.get("/daily_fact", async (request, response) => {
  const dailyFact = await DailyFact.getRandomDailyFact();
  response.send({ fact: dailyFact });
});

APP.get("/question", async (request, response) => {
  const question = await Question.getRandomQuestion();
  response.json({ question: question });
});
