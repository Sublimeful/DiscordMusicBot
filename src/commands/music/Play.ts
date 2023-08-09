import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import CommandContext from "src/structures/CommandContext";
import { handleVideos } from "src/utils/functions/Music";

export default {
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays something from the internet!")
  .addStringOption(new SlashCommandStringOption()
                  .setName("query")
                  .setDescription("A search query")
                  .setRequired(true)),
  async execute(context: CommandContext) {
    const voiceChannel = context.voiceChannel
    const interaction = context.interaction;

    if (!voiceChannel) return;  // TODO: Give error if user sent command while not in VC

    const query = interaction.options.getString("query")

    handleVideos(context);
  }
};
