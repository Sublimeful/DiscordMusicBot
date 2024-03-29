import { SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Skip to certain index of the queue!")
    .addIntegerOption(
      new SlashCommandIntegerOption()
        .setName("index")
        .setMinValue(1)
        .setRequired(true)
        .setDescription("The index to jump to"),
    ),
  execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;
    const interaction = context.interaction;

    const index = interaction.options.getInteger("index")! - 1;

    if (music.songs.length === 0) {
      const message = `There are no songs in the queue!`;
      const embed = createEmbed(MessageType.error, message);
      return context.interaction.reply({ embeds: [embed] });
    } else if (index >= music.songs.length) {
      const message = `Please enter a valid range between: 1 - ${music.songs.length}`;
      const embed = createEmbed(MessageType.error, message);
      return context.interaction.reply({ embeds: [embed] });
    }

    music.jumpSong(index);

    if (music.currentSong) {
      const message = `Jumped to song: ${music.currentSong.title}`;
      const embed = createEmbed(MessageType.info, message);
      return context.interaction.reply({ embeds: [embed] });
    }
  },
};
