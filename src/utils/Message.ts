import { EmbedBuilder, MessageCreateOptions, TextBasedChannel } from "discord.js";
import Debug from "../structures/Debug";
import CommandContext from "../structures/CommandContext";

export enum MessageType {
  "info",
  "error"
}

export function createEmbed(type: MessageType, message: string): EmbedBuilder {
  switch (type) {
    case MessageType.info:
      return new EmbedBuilder()
        .setColor("Blue")
        .setTitle(message)
    case MessageType.error:
      return new EmbedBuilder()
        .setColor("Red")
        .setTitle(message)
  }
}
