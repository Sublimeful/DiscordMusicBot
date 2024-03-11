import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song!"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;
    const skippedSong = music.skipSong();
    const embeds = [];

    if (skippedSong) {
      embeds.push(
        createEmbed(MessageType.info, `Skipped: ${skippedSong.title}`),
      );
      if (music.currentIndex === -1) {
        embeds.push(createEmbed(MessageType.info, `Now at tail of queue`));
      }
    } else {
      embeds.push(
        createEmbed(
          MessageType.info,
          `Restarting playback from the beginning of the queue!`,
        ),
      );
    }

    return context.interaction.reply({ embeds });
  },
};
