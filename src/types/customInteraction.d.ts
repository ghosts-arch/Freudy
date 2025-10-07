import { ChatInputCommandInteraction, Interaction } from "discord.js";
import { Freudy } from "..";

export type CustomChatInputCommandInteraction = ChatInputCommandInteraction & {
  client: Freudy;
};
