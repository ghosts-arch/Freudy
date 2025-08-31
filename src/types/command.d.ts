import { Interaction, SlashCommandBuilder } from "discord.js";
import { CustomInteraction } from "./customInteraction";

export interface CommandInterface {
  data: SlashCommandBuilder;
  execute: (interaction: CustomInteraction) => Promise<void>;
}
