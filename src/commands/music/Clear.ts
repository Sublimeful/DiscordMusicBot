import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue"),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;
    context.guild!.music!.clear();
    const embed = createEmbed(MessageType.info, "Queue has been cleared");
    return context.interaction.reply({ embeds: [embed] });
  },
};
