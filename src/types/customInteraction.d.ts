import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { Freudy } from "../client";

export type CustomChatInputCommandInteraction = ChatInputCommandInteraction & {
  client: Freudy;
};
