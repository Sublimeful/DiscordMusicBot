import { StreamType, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import CommandContext from "../../structures/CommandContext.ts";
import Song from "../../structures/Song.ts";

import prism from "prism-media"

import { Readable } from "stream";
import ServerMusic from "../../structures/ServerMusic.ts";

import { stream as pldlstream, video_info, stream_from_info } from "play-dl"

async function getStream(url: string): Promise<Readable> {
  const rawPlayDlStream = await pldlstream(url, { discordPlayerCompatibility: true });
  return rawPlayDlStream.stream;
}

export async function play(context: CommandContext, song: Song) {
  const yt_info = await video_info(song.videoURL)
  console.log(yt_info.video_details.title) 
  const stream = await stream_from_info(yt_info)
  const resource = createAudioResource(stream.stream, {inputType: stream.type });

  const player = context.guild?.music?.player!
  const connection = context.guild?.music?.connection!

  player.play(resource)
  connection.subscribe(player)
  console.log(player)
  console.log(connection)
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
