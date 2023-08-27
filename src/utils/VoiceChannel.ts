import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import CommandContext from "../structures/CommandContext";
import { createEmbed, MessageType } from "./Message";
import { Guild, VoiceBasedChannel } from "discord.js";


/**
 * Checks if command was made in a VC
 * @returns true if it is, else false
 */
export const inVC = function (context: CommandContext) {
  const voiceChannel = context.voiceChannel

  if (!voiceChannel) {
    const message = "Error: You are not in a Voice Channel!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
}

/**
 * Checks if command was made in the same VC as the bot
 * Also returns true if bot is not in VC
 * @returns true if it is, else false
 */
export const sameVC = function (context: CommandContext) {
  if (!context.guild?.members.me?.voice.channel) return true;

  const botVoiceChannel = context.guild?.music?.connection?.joinConfig.channelId ?? context.guild?.members.me?.voice.channelId;
  if (context.voiceChannel?.id !== botVoiceChannel) {
    const message = "Error: You are not in the same voice channel as the bot!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
}

/**
 * Join the voice channel of a specified guild
 * @param guild: the guild where the voice channel is
 * @param voiceChannel: the voice channel to join
 * @returns a voice connection
 */
export const joinVC = function(guild: Guild, voiceChannel: VoiceBasedChannel): VoiceConnection {
  return joinVoiceChannel({
    adapterCreator: guild.voiceAdapterCreator,
    channelId: voiceChannel.id,
    guildId: guild.id,
    selfDeaf: true
  });
}
