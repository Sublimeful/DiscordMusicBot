import { StreamType, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import CommandContext from "../../structures/CommandContext.ts";
import Song from "../../structures/Song.ts";

import ServerMusic from "../../structures/ServerMusic.ts";

import { video_info, stream_from_info } from "play-dl"
import { PlayableVideo, YTPlayableVideo } from "../../structures/PlayableVideo.ts";

async function getPlayableVideo(song: Song): Promise<PlayableVideo> {
  const yt_info = await video_info(song.videoURL)
  const stream = await stream_from_info(yt_info)

  return new YTPlayableVideo(stream, yt_info);
}

export async function play(context: CommandContext, song: Song) {
  const playableVideo = await getPlayableVideo(song);
  const resource = createAudioResource(playableVideo.stream, {inputType: playableVideo.streamType });
  const player = context.guild?.music?.player!
  const connection = context.guild?.music?.connection!

  player.play(resource)
  connection.subscribe(player)

  player.on("error", error => {
    console.log(error)
  })

  player.on("stateChange", error => {
    console.log(error)
  })
}

export async function handleVideos(context: CommandContext, songs: Song[]) {
  if (!context.voiceChannel || !context.guild) return;

  if (!context.guild.music) {
    context.guild.music = new ServerMusic(songs)
  }

  const voiceChannel = context.voiceChannel
  const music = context.guild.music
  const currentSong = music.queue.nextSong()

  if (!currentSong) return;

  try {
    const connection = joinVoiceChannel({
      adapterCreator: context.guild.voiceAdapterCreator,
      channelId: voiceChannel.id,
      guildId: context.guild.id,
      selfDeaf: true
    });

    context.guild.music.connection = connection;

    play(context, currentSong);
  } catch(error) {
    delete context.guild.music;
  }
}
