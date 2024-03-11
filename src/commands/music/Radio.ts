import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandSubcommandBuilder } from "discord.js";
import CommandContext from "../../structures/CommandContext.ts";
import { inVC, sameVC, validVC } from "../../utils/VoiceChannel.ts";
import { MessageType, createEmbed } from "../../utils/Message.ts";

export default {
  data: new SlashCommandBuilder()
  .setName("radio")
  .setDescription("Radio mode adds related songs to the queue, songs that are already in the queue will not be added")
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("info")
    .setDescription("Shows info regarding the status of the radio"))
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("on")
    .setDescription("Turn radio mode on"))
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("off")
    .setDescription("Turn radio mode off"))
  .addSubcommand(new SlashCommandSubcommandBuilder()
    .setName("options")
    .setDescription("Options related to song selection")
    .addIntegerOption(new SlashCommandIntegerOption()
      .setName("limit")
      .setMinValue(1)
      .setDescription("Limits the max number of related songs that can be added at once"))
    .addIntegerOption(new SlashCommandIntegerOption()
      .setName("randomness")
      .setMinValue(1)
      .setDescription("How random the related songs will be"))
    .addBooleanOption(new SlashCommandBooleanOption()
      .setName("unique")
      .setDescription("Whether related songs that are already in queue should be added"))),
  async execute(context: CommandContext) {
    if (!inVC(context) || !sameVC(context) || !validVC(context)) return;

    const interaction = context.interaction;
    const music = context.guild!.music!;

    let embed = createEmbed(MessageType.info, "Please type a valid command!");

    switch(interaction.options.getSubcommand()) {
      case "info": {
        let fragmentedMessages: string[] = [];

        fragmentedMessages.push(`Radio is ${music.options.radio.isOn ? "on" : "off"}`);
        fragmentedMessages.push(`Related songs limit: ${music.options.radio.relatedSongsLimit}`);
        fragmentedMessages.push(`Related songs randomness: ${music.options.radio.relatedSongsRandomness}`);
        fragmentedMessages.push(`Suggest unique songs: ${music.options.radio.suggestUniqueSongs}`);

        embed = createEmbed(MessageType.info, fragmentedMessages.join("\n"));
        break;
      }
      case "on": {
        music.options.radio.isOn = true;
        embed = createEmbed(MessageType.info, "Radio mode is now on!");
        break;
      }
      case "off": {
        music.options.radio.isOn = false;
        embed = createEmbed(MessageType.info, "Radio mode is now off!");
        break;
      }
      case "options": {
        const limit = interaction.options.getInteger("limit");
        const randomness = interaction.options.getInteger("randomness");
        const unique = interaction.options.getBoolean("unique");

        if (limit === null && randomness == null && unique == null) break;

        let fragmentedMessages: string[] = [];

        if (limit !== null) {
          fragmentedMessages.push(`Related songs limit: ${music.options.radio.relatedSongsLimit} -> ${limit}`);
          music.options.radio.relatedSongsLimit = limit;
        }

        if (randomness !== null) {
          fragmentedMessages.push(`Related songs randomness: ${music.options.radio.relatedSongsRandomness} -> ${randomness}`);
          music.options.radio.relatedSongsRandomness = randomness;
        }

        if (unique !== null) {
          fragmentedMessages.push(`Suggest unique songs: ${music.options.radio.suggestUniqueSongs} -> ${unique}`);
          music.options.radio.suggestUniqueSongs = unique;
        }

        embed = createEmbed(MessageType.info, fragmentedMessages.join("\n"));
        break;
      }
      default: {
        break;
      }
    }

    interaction.reply({ embeds: [embed] });
  }
};
