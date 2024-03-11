import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import CommandContext from "../structures/CommandContext.ts";
import { createEmbed, MessageType } from "./Message.ts";
import { Guild, PermissionFlagsBits, VoiceBasedChannel } from "discord.js";

/**
 * Checks if command was made in a VC
 * @returns true if it is, else false
 */
export const inVC = function (context: CommandContext) {
  const voiceChannel = context.voiceChannel;

  if (!voiceChannel) {
    const message = "Error: You are not in a Voice Channel!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
};

/**
 * Checks if command was made in the same VC as the bot
 * Also returns true if bot is not in VC
 * @returns true if it is, else false
 */
export const sameVC = function (context: CommandContext) {
  if (!context.guild?.members.me?.voice.channel) return true;

  const botVoiceChannel =
    context.guild?.music?.connection?.joinConfig.channelId ??
    context.guild?.members.me?.voice.channelId;
  if (context.voiceChannel?.id !== botVoiceChannel) {
    const message = "Error: You are not in the same voice channel as the bot!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
};

/**
 * Checks if the voice channel user is in is valid
 * @returns true if it is, else false
 */
export const validVC = function (context: CommandContext) {
  const voiceChannel = context.voiceChannel;

  if (!context.guild?.members.me) return true;
  if (voiceChannel?.id === context.guild.members.me.voice.channelId)
    return true;

  if (!voiceChannel?.joinable) {
    const message = "Error: Cannot join voice channel!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  if (
    !voiceChannel
      .permissionsFor(context.guild.members.me)
      .has(PermissionFlagsBits.Speak)
  ) {
    const message = "Error: I have no permissions to speak in that VC!";
    const embed = createEmbed(MessageType.error, message);
    context.interaction.reply({ embeds: [embed] });
    return false;
  }

  return true;
};

/**
 * Join the voice channel of a specified guild
 * @param guild: the guild where the voice channel is
 * @param voiceChannel: the voice channel to join
 * @returns a voice connection
 */
export const joinVC = function (
  guild: Guild,
  voiceChannel: VoiceBasedChannel,
): VoiceConnection {
  const voiceConnection = joinVoiceChannel({
    adapterCreator: guild.voiceAdapterCreator,
    channelId: voiceChannel.id,
    guildId: guild.id,
    selfDeaf: true,
  });

  //<{{ Fix for youtube livestreams cutting out in the middle of playback
  const networkStateChangeHandler = (
    oldNetworkState: any,
    newNetworkState: any,
  ) => {
    const newUdp = Reflect.get(newNetworkState, "udp");
    clearInterval(newUdp?.keepAliveInterval);
  };

  voiceConnection.on("stateChange", (oldState, newState) => {
    const oldNetworking = Reflect.get(oldState, "networking");
    const newNetworking = Reflect.get(newState, "networking");

    oldNetworking?.off("stateChange", networkStateChangeHandler);
    newNetworking?.on("stateChange", networkStateChangeHandler);
  });
  //}}>

  return voiceConnection;
};
