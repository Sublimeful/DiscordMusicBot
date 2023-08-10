import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import Song from "../../structures/Song.ts";
import { handleVideos } from "../../utils/functions/Music.ts";

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

    const query = (interaction.options.getString("query"))!

    const songs: Song[] = [{videoURL: query}]

    handleVideos(context, songs);
  }
};
