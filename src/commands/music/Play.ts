import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import handleQuery from "../../utils/functions/music/handleQuery.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

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

    if (!voiceChannel) {
      const message = "Error: You are not in a Voice Channel!";
      const embed = createEmbed(MessageType.error, message);
      return context.interaction.reply({ embeds: [embed] });
    }

    const query = (interaction.options.getString("query"))!

    handleQuery(context, query);
  }
};
