import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";
import Debug from "../../structures/Debug.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current song!"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context)) return;
    if (!context.guild || !context.guild.music) {
      return Debug.error("'skip' command somehow executed when not in a guild or guild music structure not created!");
    }

    const skippedSong = context.guild.music.skipSong();

    if (skippedSong)
      var message = `Skipped: ${skippedSong.title}`;
    else
      var message = `Nothing was skipped, at tail of queue!`;

    const embed = createEmbed(MessageType.info, message);
    return context.interaction.reply({ embeds: [embed] });
  }
};
