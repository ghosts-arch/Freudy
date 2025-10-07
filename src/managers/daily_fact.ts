import { Sequelize } from "sequelize";
import { Freudy } from "../client";
import { DailyFact } from "../database/database";
import { info } from "../utils/logging";
import { EmbedBuilder } from "discord.js";

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
  const channel = await client.channels.fetch(
    process.env.DAILY_FACT_CHANNEL_ID
  );
  console.log(DailyFact);
  const fact = await DailyFact.findOne({
    order: Sequelize.literal("random()"),
  });
  console.log(fact);
  if (!fact) return;
  if (channel?.isSendable()) {
    const embed = new EmbedBuilder().setColor("Blue").setDescription(fact.fact);
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
