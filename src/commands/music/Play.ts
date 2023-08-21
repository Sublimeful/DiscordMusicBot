import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import handleQuery from "../../utils/functions/music/handleQuery.ts";
import { inVC, sameVC } from "../../utils/VoiceChannel.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays something from the internet!")
  .addStringOption(new SlashCommandStringOption()
                  .setName("query")
                  .setDescription("A search query")
                  .setRequired(true)),
  async execute(context: CommandContext) {
    const interaction = context.interaction;

    if (!inVC(context) || !sameVC(context)) return;

    const query = (interaction.options.getString("query"))!

    handleQuery(context, query);
  }
};
