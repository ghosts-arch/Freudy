import { Freudy } from "./client";
import { config } from "dotenv";

import { info } from "./utils/logging";

config();

const client = new Freudy();
(async () => {
  await client.init();
})();
