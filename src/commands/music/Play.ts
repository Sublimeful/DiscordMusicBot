import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("Hello"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
  }
};
