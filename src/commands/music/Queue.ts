import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC } from "../../utils/VoiceChannel.ts";
import { createPagination } from "../../utils/Message.ts";
import Debug from "../../structures/Debug.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Displays the current queue"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context)) return;
    if (!context.guild || !context.guild.music) {
      return Debug.error("'queue' command somehow executed when not in a guild or guild music structure not created!");
    }

    const music = context.guild.music;
    const songs = music.songs;
    const pages: EmbedBuilder[] = []
    const songsPerPage = 5;

    for (let i = 0; i < songs.length; i += songsPerPage) {
      let songsList = "";
      for (let j = 0; j < Math.min(songs.length - i, songsPerPage); j++) {
        let currIndex = i + j;
        let currSong = songs[currIndex];
        songsList += `${currIndex === music.currentIndex ? "-> " : ""}${currIndex + 1}: ${currSong.title} \n`;
      }
      const page = new EmbedBuilder()
        .setDescription(songsList);
      pages.push(page);
    }

    const initialPage = music.currentIndex === -1 ? 0 : Math.floor(music.currentIndex / songsPerPage);
    await createPagination(context.interaction, pages, initialPage);
  }
};
