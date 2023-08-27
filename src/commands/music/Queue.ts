import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { createPagination } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Displays the current queue"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;
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
        .setTitle("Queue")
        .setDescription(songsList);
      pages.push(page);
    }

    const initialPage = music.currentIndex === -1 ? 0 : Math.floor(music.currentIndex / songsPerPage);
    await createPagination(context.interaction, pages, initialPage);
  }
};
