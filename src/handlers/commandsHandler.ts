import { readdirSync } from "node:fs";
import path from "node:path";
import { Collection, REST, Routes } from "discord.js";
import type { CommandInterface } from "../types/command";

const registerCommands = async (
	commands: Collection<string, CommandInterface>,
) => {
	const rest = new REST().setToken(process.env.CLIENT_TOKEN);
	await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
		body: commands.map((command) => command.data.toJSON()),
	});
};

export const commandsHandler = async (): Promise<
	Collection<string, CommandInterface>
> => {
	const commands = new Collection<string, CommandInterface>();
	const commandsPath = path.join(__dirname, "../commands");
	const commandsFiles = readdirSync(commandsPath);
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
