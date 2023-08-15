import { joinVoiceChannel } from "@discordjs/voice";
import PlayerStateChange from "../../../events/PlayerStateChange";
import CommandContext from "../../../structures/CommandContext";
import ServerMusic from "../../../structures/ServerMusic";
import { Debugger } from "../Debug";
import { getSongsFromQuery } from "./getSongsFromQuery";
import play from "./play";

export default async function handleQuery(context: CommandContext, query: string) {
  if (!context.voiceChannel || !context.guild) return;  // TODO: Raise error? But this function should only be called when these two things are truthy

  if (!context.guild.music) {
    context.guild.music = new ServerMusic();

    // Bind listeners to music player
    PlayerStateChange(context.guild.music, context.interaction.channel!);
  }

  const voiceChannel = context.voiceChannel
  const music = context.guild.music

  // Search query and get songs
  const songs = await getSongsFromQuery(query);

  if (songs.length > 0) {
    // TODO: Notification showing enqueued songs
    music.enqueue(songs);
  } else {
    // TODO: Notification saying no songs found
    return;
  }

  if (music.currentState !== "idle") return;  // Only play song when nothing is playing

  const currentSong = music.nextSong()!

  Debugger.log(currentSong)

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
