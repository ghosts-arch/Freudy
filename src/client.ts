import { Client, type Collection, GatewayIntentBits } from "discord.js";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { Sequelize } from "sequelize";
import type * as schema from "@/core/database/schema";
import { ApplicationServices } from "./core/application.services";
import { commandsHandler } from "./handlers/commandsHandler";
import { eventsHandler } from "./handlers/eventsHandler";
import { start } from "./managers/dailyFact";
import type { ICommand } from "./types/commandInterface";
import { error, info } from "./utils/logging";
import type { CooldownConfig } from "./core/game/cooldowns/cooldowns.service";

export class Freudy extends Client {
	declare database: Sequelize;
	declare commands: Collection<string, ICommand>;
	declare services: ApplicationServices;
	declare applicationServices: ApplicationServices;
	constructor(db: BunSQLiteDatabase<typeof schema>) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMembers,
			],
		});
		const cooldownConfig: CooldownConfig = {
			duration: 14_400_000,
		};
		this.applicationServices = new ApplicationServices(db, cooldownConfig);
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
