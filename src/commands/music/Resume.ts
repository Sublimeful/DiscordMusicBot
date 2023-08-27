import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resumes current playback"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;
    context.guild!.music!.resume();
    const embed = createEmbed(MessageType.info, `Player has been resumed!`);
    context.interaction.reply({ embeds: [embed] });
  }
};
