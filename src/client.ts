import { Client, type Collection, GatewayIntentBits } from "discord.js";
import type { Sequelize } from "sequelize";
import { commandsHandler } from "./handlers/commandsHandler";
import { eventsHandler } from "./handlers/eventsHandler";
import { start } from "./managers/dailyFact";
import type { ICommand } from "./types/commandInterface";
import { Cooldowns, cooldownConfig } from "./utils/cooldowns";
import { error, info } from "./utils/logging";

export class Freudy extends Client {
  declare database: Sequelize;
  declare commands: Collection<string, ICommand>;
  declare cooldowns: Cooldowns;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
      ],
    });
    this.cooldowns = new Cooldowns(cooldownConfig);
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
      process.exit(1);
    }
  }
}
