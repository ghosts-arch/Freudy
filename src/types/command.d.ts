import {
  Interaction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { CustomInteraction } from "./customInteraction";
import { PERMISSIONS_LEVEL } from "../enums/permissionsLevel";

export interface CommandInterface {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  hasCooldown?: boolean;
  permission_level: PERMISSIONS_LEVEL;
  execute: (interaction: CustomInteraction) => Promise<void>;
}
