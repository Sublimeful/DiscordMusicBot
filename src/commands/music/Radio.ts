import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("radio")
  .setDescription("Radio mode adds related songs to the queue, songs that are already in the queue will not be added")
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("on")
    .setDescription("Turn radio mode on"))
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("off")
    .setDescription("Turn radio mode off")),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const interaction = context.interaction;
    const music = context.guild!.music!;

    if (interaction.options.getSubcommand() === "on") {
      music.radio = true;
      var embed = createEmbed(MessageType.info, "Radio mode is now on!");
    } else {
      music.radio = true;
      var embed = createEmbed(MessageType.info, "Radio mode is now off!");
    }

    interaction.reply({ embeds: [embed] });
  }
};
