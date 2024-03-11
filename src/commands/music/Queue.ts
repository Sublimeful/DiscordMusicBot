import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { createStringListPagination } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current queue"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;
    const songs = music.songs;
    const songsPerPage = 5;

    const stringList = songs.map(
      (song, index) =>
        `${index === music.currentIndex ? "-> " : ""}${index + 1}: [${song.title}](${song.url})`,
    );

    const initialPage =
      music.currentIndex === -1
        ? 0
        : Math.floor(music.currentIndex / songsPerPage);

    await createStringListPagination(
      context.interaction,
      stringList,
      "Queue",
      "There are no songs, add some now!",
      songsPerPage,
      initialPage,
    );
  },
};
