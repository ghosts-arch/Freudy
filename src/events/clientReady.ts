import { Events } from "discord.js";
import type { EventInterface } from "../types/event";
import { info } from "../utils/logging";

const clientReady: EventInterface<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	execute: async (client) => {
		await info(`${client.user?.username} is ready !`);
	},
};

export default clientReady;
