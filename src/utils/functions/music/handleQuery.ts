import { joinVoiceChannel } from "@discordjs/voice";
import PlayerStateChange from "../../../events/PlayerStateChange";
import CommandContext from "../../../structures/CommandContext";
import ServerMusic from "../../../structures/ServerMusic";
import Debug from "../../../structures/Debug";
import { getSongsFromQuery } from "./getSongsFromQuery";
import play from "./play";
import { MessageType, createEmbed } from "../../Message";

export default async function handleQuery(context: CommandContext, query: string) {
  if (!context.voiceChannel || !context.guild || !context.interaction.channel) {
    return Debug.error("Raise error? But this function should only be called when these things are truthy");
  }

  if (!context.guild.music) {
    context.guild.music = new ServerMusic();

    // Bind listeners to music player
    PlayerStateChange(context.guild.music, context.interaction.channel);
  }

  const voiceChannel = context.voiceChannel
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

  if (music.currentState !== "idle") return;  // Only play song when nothing is playing

  // guaranteed to be a next song since we just added some
  const currentSong = music.nextSong()!

  Debug.log(currentSong)

  try {
    // try joining the Voice Channel the user who ran the command is in
    const connection = joinVoiceChannel({
      adapterCreator: context.guild.voiceAdapterCreator,
      channelId: voiceChannel.id,
      guildId: context.guild.id,
      selfDeaf: true
    });

    context.guild.music.connection = connection;

    play(context.guild.music, currentSong);

  } catch(error) {
    delete context.guild.music;
  }
}
