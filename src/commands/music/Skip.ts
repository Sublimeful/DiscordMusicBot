import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC } from "../../utils/VoiceChannel.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current song!"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context)) return;
  }
};
