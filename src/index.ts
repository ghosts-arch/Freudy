import { Freudy } from "./client";
import { config } from "dotenv";
import { app } from "./api/api";

import { createServer } from "http";
import { setupWebSocket } from "./ws/ws";
import { info } from "./utils/logging";

config();

const server = createServer(app);
setupWebSocket(server);

server.listen(3001, () => {
  console.log("http://127.0.0.1");
});

const client = new Freudy();
(async () => {
  await client.init();
})();

process.on("SIGINT", async () => {
  await info(`Bot is disconnected !`);
  process.exit(0);
});
