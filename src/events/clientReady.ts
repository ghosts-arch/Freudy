import { Events } from "discord.js";
import { EventInterface } from "../types/event";
import { Freudy } from "../client";
import { info } from "../utils/logging";

const clientReady: EventInterface = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Freudy) => {
    await info(`${client.user?.username} is ready !`);
  },
};

export default clientReady;
