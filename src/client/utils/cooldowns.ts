import { Collection } from "discord.js";
import { CustomChatInputCommandInteraction } from "../types/customInteraction";

type CooldownsConfig = {
  duration: number;
};

export const cooldownConfig: CooldownsConfig = {
  duration: 14_400_000,
};

export class Cooldowns {
  private declare cooldowns: Collection<string, number>;
  private declare config: CooldownsConfig;

  constructor(config: CooldownsConfig) {
    this.cooldowns = new Collection<string, number>();
    this.config = config;
  }

  addUser = (
    userId: string,
    interaction: CustomChatInputCommandInteraction
  ): void => {
    this.cooldowns.set(userId, Date.now());
    setTimeout(() => {
      this.cooldowns.delete(userId);
      if (!interaction.channel?.isSendable()) return;
      interaction.channel.send({
        content: `<@!${interaction.user.id}>, vous pouvez a nouveau jouer !`,
      });
    }, this.config.duration);
  };

  findUser = (userId: string): boolean => {
    return this.cooldowns.has(userId);
  };

  getRemainingTimeFor = (userId: string): number => {
    const userRemaningCooldown = this.cooldowns.get(userId);
    if (!userRemaningCooldown) {
      throw Error();
    }
    const now = Date.now();
    const timeSinceLastUsage = now - userRemaningCooldown;
    return this.config.duration - timeSinceLastUsage;
  };

  static formatCooldown = (cooldown: number): string => {
    return `${Math.floor(cooldown / 3_600_000)} heure(s) ${Math.floor(
      (cooldown % 3_600_000) / 60_000
    )} minute(s) ${Math.floor((cooldown % 60_000) / 1_000)} seconde(s)`;
  };
}
