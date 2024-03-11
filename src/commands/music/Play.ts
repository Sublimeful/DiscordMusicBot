import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import handleQuery from "../../utils/functions/music/handleQuery.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays something from the internet!")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("query")
        .setDescription("A search query")
        .setRequired(true),
    ),
  execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const interaction = context.interaction;
    const query = interaction.options.getString("query")!;

    handleQuery(context, query);
  },
};
