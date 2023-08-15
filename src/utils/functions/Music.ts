import { StreamType, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import CommandContext from "../../structures/CommandContext.ts";
import Song from "../../structures/Song.ts";

import ServerMusic from "../../structures/ServerMusic.ts";
import { Debugger } from "./Debug.ts";

import { video_info, stream_from_info } from "play-dl"
import { PlayableVideo, YTPlayableVideo } from "../../structures/PlayableVideo.ts";
import { Guild } from "discord.js";

async function getPlayableVideo(song: Song): Promise<PlayableVideo> {
  const yt_info = await video_info(song.videoURL)
  const stream = await stream_from_info(yt_info)

  return new YTPlayableVideo(stream, yt_info);
}

export async function play(music: ServerMusic, song: Song) {
  if (!music.connection) return;  // TODO: Raise error when this function is called while the bot is not connected to a voice channel

  const playableVideo = await getPlayableVideo(song);
  const resource = createAudioResource(playableVideo.stream, {inputType: playableVideo.streamType });
  const player = music.player
  const connection = music.connection

  player.play(resource)
  connection.subscribe(player)
}

export function handleVideos(context: CommandContext, songs: Song[]) {
  if (!context.voiceChannel || !context.guild) return;  // TODO: Raise error? But this function should only be called when these two things are truthy
  if (!context.guild.music) context.guild.music = new ServerMusic();

  const voiceChannel = context.voiceChannel
  const music = context.guild.music

  music.enqueue(songs);

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
