import express from "express";
import { DailyFact } from "../database/database";

export const APP = express();

const allowedOrigins = ["127.0.0.1", "freudy-website.vercel.app"];
APP.use((request, result, next) => {
  const origin = request.headers.origin;
  console.log(origin);
  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      return result.status(403).json({ message: "forbidden" });
    }
  }
  next();
});
APP.get("/", (request, result) => {
  result.send({ message: "Pong !" });
});

APP.get("/daily_fact", async (request, result) => {
  const dailyFact = await DailyFact.getRandomDailyFact();
  result.send({ fact: dailyFact });
});
