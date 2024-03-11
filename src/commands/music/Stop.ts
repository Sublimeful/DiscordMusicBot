import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops current playback"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;
    context.guild!.music!.stop();
    const embed = createEmbed(MessageType.info, `Player has been stopped!`);
    context.interaction.reply({ embeds: [embed] });
  },
};
