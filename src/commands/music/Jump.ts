import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption, SlashCommandIntegerOption } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC } from "../../utils/VoiceChannel.ts";
import Debug from "../../structures/Debug.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("jump")
  .setDescription("Plays something from the internet!")
  .addIntegerOption(new SlashCommandIntegerOption()
                      .setName("index")
                      .setMinValue(1)
                      .setRequired(true)
                      .setDescription("Skip to certain index of the queue")),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context)) return;
    if (!context.guild || !context.guild.music) {
      return Debug.error("'jump' command somehow executed when not in a guild or guild music structure not created!");
    }

    const music = context.guild.music;
    const interaction = context.interaction;
    const index = (interaction.options.getInteger("index"))!

    // Index starts at 1, but jumpSong starts at 0
    const skippedSong = music.jumpSong(index - 1);
    if (skippedSong)
      var message = `Skipped: ${skippedSong.title}`;
    else
      var message = `Please enter a valid range between: 1 - ${music.songs.length}`;

    const embed = createEmbed(MessageType.info, message);
    return context.interaction.reply({ embeds: [embed] });
  }
};
