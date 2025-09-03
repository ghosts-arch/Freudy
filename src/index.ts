import { Freudy } from "./client";
import { config } from "dotenv";

import { info } from "./utils/logging";
import { APP } from "./api/api";

config();

const client = new Freudy();
(async () => {
  await client.init();
})();

APP.listen(process.env.API_PORT);
process.on("SIGINT", async () => {
  await info(`Bot is disconnected !`);
  process.exit(0);
});
