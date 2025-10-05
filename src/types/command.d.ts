import {
  Interaction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { CustomInteraction } from "./customInteraction";

export interface CommandInterface {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  hasCooldown?: boolean;
  isAdministratorCommand: boolean;
  execute: (interaction: CustomInteraction) => Promise<void>;
}
