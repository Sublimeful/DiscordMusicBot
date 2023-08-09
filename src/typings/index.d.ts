
import { ChatInputCommandInteraction } from "discord.js";

declare module "discord.js" {
  export interface Guild {
    queue?: ServerQueue;
  }
}
