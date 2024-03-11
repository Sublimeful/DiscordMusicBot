import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
} from "discord.js";
import ServerMusic from "../structures/ServerMusic.ts";

declare module "discord.js" {
  export interface Guild {
    music?: ServerMusic;
  }
}
