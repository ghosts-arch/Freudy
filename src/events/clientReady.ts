import { Events } from "discord.js";
import { EventInterface } from "../types/event";
import { Freudy } from "../client";
import { info } from "../utils/logging";
import { getIo } from "../ws/ws";

const clientReady: EventInterface = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Freudy) => {
    // console.info(`${client.user?.username} is ready !`);
    await info(`${client.user?.username} is ready !`);
    getIo().emit("client_ready", {
      type: ["event", "client"],
      message: `${client.user?.username} is ready !`,
      timestamp: new Date(),
    });
  },
};

export default clientReady;
