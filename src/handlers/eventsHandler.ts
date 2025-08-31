import { Freudy } from "../client";
import path from "node:path";
import { readdirSync } from "fs";
import { EventInterface } from "../types/event";
import { getIo } from "../ws/ws";

export const eventsHandler = async (client: Freudy) => {
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js")
  );
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
    getIo().emit("event_handler", {
      message: "test",
      type: ["test"],
      timestamp: Date(),
    });
  }
};
