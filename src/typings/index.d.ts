import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";

declare module "discord.js" {
  export interface Guild {
    queue?: ServerQueue;
  }
}
