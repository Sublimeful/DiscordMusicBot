import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses current playback"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;
    context.guild!.music!.pause();
    const embed = createEmbed(MessageType.info, `Player has been paused!`);
    context.interaction.reply({ embeds: [embed] });
  },
};
