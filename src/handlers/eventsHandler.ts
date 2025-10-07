import { Freudy } from "..";
import path from "path";
import { readdirSync } from "fs";
import type { EventInterface } from "../types/event";

export const eventsHandler = async (client: Freudy) => {
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = readdirSync(eventsPath);
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const { default: event } = (await import(filePath)) as {
      default: EventInterface;
    };
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};
