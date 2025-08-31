import { Client, Collection, GatewayIntentBits } from "discord.js";
import { eventsHandler } from "./handlers/eventsHandler";
import { start } from "./managers/daily_fact";
import { error, info } from "./utils/logging";
import { Sequelize } from "sequelize";
import { getIo } from "./ws/ws";
import { commandsHandler } from "./handlers/commandsHandler";
import { CommandInterface } from "./types/command";
import { Cooldowns } from "./utils/cooldowns";

export class Freudy extends Client {
  declare database: Sequelize;
  declare commands: Collection<string, CommandInterface>;
  declare cooldowns: Cooldowns;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.cooldowns = new Cooldowns();
  }

  async init() {
    await start(this);
    await info("dailyMessageManager started with sucess.");
    eventsHandler(this);
    await info("events loaded with success.");
    this.commands = await commandsHandler();
    try {
      await this.login(process.env.CLIENT_TOKEN);
    } catch (err) {
      console.log(err);
      error((err as Error).message);
      getIo().emit("login_error", {
        message: `${(err as Error).message}`,
        type: ["event", "client", "error"],
        timestamp: Date(),
      });
      process.exit(1);
    }
  }
}
