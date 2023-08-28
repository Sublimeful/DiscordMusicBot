import { Client, TextChannel } from "discord.js";
import { CommandsMap } from "../Commands.ts";
import CommandContext from "../structures/CommandContext.ts";
import ServerMusic from "../structures/ServerMusic.ts";

export default (client: Client): void => {
  client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = CommandsMap.get(interaction.commandName);

    if (!command) {
      return console.error(`No command matching ${interaction.commandName} was found.`);
    }

    try {
      const context = new CommandContext(interaction);

      if (!context.guild || !context.interaction.channel) {
        interaction.reply("Commands must be sent in a server's valid text channel!");
        return;
      }

      // Create music instance for guild here before any music commands are executed
      if (!context.guild.music) {
        context.guild.music = new ServerMusic(context.interaction.channel as TextChannel);
      }

      await command.execute(context);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  });
};
