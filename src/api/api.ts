import express from "express";
import { DailyFact } from "../database/database";

export const app = express();

app.get("/daily_facts", async (req, res) => {
  const facts = await DailyFact.findAll();
  res.send(facts);
});
