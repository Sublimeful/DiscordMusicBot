import PlayerStateChange from "../../../events/PlayerStateChange";
import CommandContext from "../../../structures/CommandContext";
import ServerMusic from "../../../structures/ServerMusic";
import Debug from "../../../structures/Debug";
import { getSongsFromQuery } from "./getSongsFromQuery";
import { MessageType, createEmbed } from "../../Message";
import { joinVC } from "../../VoiceChannel";

export default async function handleQuery(context: CommandContext, query: string) {
  if (!context.voiceChannel || !context.guild || !context.interaction.channel) {
    return Debug.error("Raise error? But this function should only be called when these things are truthy");
  }

  if (!context.guild.music) {
    context.guild.music = new ServerMusic();

    // Bind listeners to music player
    PlayerStateChange(context.guild.music, context.interaction.channel);
  }

  const music = context.guild.music

  // Search query and get songs
  const songs = await getSongsFromQuery(query);

  if (songs.length > 0) {
    music.enqueue(songs);

    const message = `Added: ${songs.length} songs`;
    const embed = createEmbed(MessageType.info, message);
    context.interaction.reply({ embeds: [embed] });
  } else {
    const message = `Error: No songs were found`;
    const embed = createEmbed(MessageType.error, message);
    return context.interaction.reply({ embeds: [embed] });
  }

  if (music.currentIndex !== -1) return;  // Only play song when queue is at it's EOF state

  try {
    // try joining the Voice Channel the user who ran the command is in
    music.connection = joinVC(context.guild, context.voiceChannel);
    music.jumpSong(music.songs.length - songs.length);  // Jump to the first song of the added songs
  } catch(error) {
    delete context.guild.music;
  }
}
