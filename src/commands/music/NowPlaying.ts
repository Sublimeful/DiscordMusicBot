import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("nowplaying")
  .setDescription("Displays the now playing song"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;
    const currentSong = music.currentSong;

    if (currentSong) {
      var embed = createEmbed(MessageType.info, `Now Playing: ${currentSong.title}`);
    } else {
      var embed = createEmbed(MessageType.info, `Nothing is playing right now`);
    }

    context.interaction.reply({ embeds: [embed] });
  }
};
