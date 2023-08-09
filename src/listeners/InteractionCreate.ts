import { Client } from "discord.js";
import { CommandsMap } from "../Commands";
import CommandContext from "../structures/CommandContext";

export default (client: Client): void => {
  client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = CommandsMap.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      const context = new CommandContext(interaction);
      await command.execute(context);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  });
};
