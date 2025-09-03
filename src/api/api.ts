import express from "express";
import { DailyFact } from "../database/database";

export const APP = express();

APP.get("/", (request, result) => {
  result.send({ message: "Pong !" });
});

APP.get("/daily_fact", async (request, result) => {
  const dailyFact = await DailyFact.getRandomDailyFact();
  result.send({ fact: dailyFact });
});
