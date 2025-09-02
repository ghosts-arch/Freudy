import { Freudy } from "./client";
import { config } from "dotenv";

import { info } from "./utils/logging";

config();

const client = new Freudy();
(async () => {
  await client.init();
})();

process.on("SIGINT", async () => {
  await info(`Bot is disconnected !`);
  process.exit(0);
});
