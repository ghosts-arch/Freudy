import { Collection, REST, Routes } from "discord.js";
import { CommandInterface } from "../types/command";
import path from "path";
import { readdirSync } from "fs";

import { info } from "../utils/logging";
import { get } from "http";

const registerCommands = async (
  commands: Collection<string, CommandInterface>
) => {
  const rest = new REST().setToken(process.env.CLIENT_TOKEN);
  const data = await rest.put(
    Routes.applicationCommands(process.env.APPLICATION_ID),
    {
      body: commands.map((command) => command.data.toJSON()),
    }
  );
};

export const commandsHandler = async (): Promise<
  Collection<string, CommandInterface>
> => {
  const commands = new Collection<string, CommandInterface>();
  const commandsPath = path.join(__dirname, "../commands");
  const commandsFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const commandFile of commandsFiles) {
    const filePath = path.join(commandsPath, commandFile);
    const { default: command } = (await import(filePath)) as {
      default: CommandInterface;
    };
    commands.set(command.data.name, command);
  }
  await registerCommands(commands);
  return commands;
};
