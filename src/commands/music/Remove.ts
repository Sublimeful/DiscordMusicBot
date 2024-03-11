import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import {
  MessageType,
  createEmbed,
  createStringListPagination,
} from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes songs from the queue")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("singular")
        .setDescription("Just remove a single song")
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setName("index")
            .setDescription("Index of the song you want removed")
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("range")
        .setDescription("Remove a range of songs")
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setName("from")
            .setDescription("Index of the first song")
            .setMinValue(1)
            .setRequired(true),
        )
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setName("to")
            .setDescription("Index of the last song")
            .setMinValue(1)
            .setRequired(true),
        ),
    ),
  execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const music = context.guild!.music!;

    if (context.interaction.options.getSubcommand() === "singular") {
      const index = context.interaction.options.getInteger("index")! - 1;

      if (index >= music.songs.length) {
        const embed = createEmbed(
          MessageType.error,
          `Please enter a valid index from 1-${music.songs.length}`,
        );
        return context.interaction.reply({ embeds: [embed] });
      }

      const removedSong = music.remove(index!)[0];
      const embed = createEmbed(
        MessageType.info,
        `Removed song: ${removedSong.title}`,
      );
      return context.interaction.reply({ embeds: [embed] });
    } else {
      const from = context.interaction.options.getInteger("from")! - 1;
      const to = context.interaction.options.getInteger("to")! - 1;

      if (to < from) {
        const embed = createEmbed(
          MessageType.error,
          `'to' must be greater than or equal to 'from'`,
        );
        return context.interaction.reply({ embeds: [embed] });
      }

      const removedSongs = music.remove(from, to);
      const stringList = removedSongs.map(
        (song, index) => `${index + 1}: [${song.title}](${song.url})`,
      );

      createStringListPagination(
        context.interaction,
        stringList,
        "Removed Songs",
      );
    }
  },
};
