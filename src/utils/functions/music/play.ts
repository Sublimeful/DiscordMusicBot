import { createAudioResource } from "@discordjs/voice";
import ServerMusic from "../../../structures/ServerMusic";
import { Song } from "../../../structures/Song";

/**
 * Plays a song immediately to the specified server's music player
 */
export default async function play(music: ServerMusic, song: Song) {
  if (!music.connection) return;  // TODO: Raise error when this function is called while the bot is not connected to a voice channel

  const stream = await song.getStream();
  const resource = createAudioResource(stream.stream, {inputType: stream.type });
  const player = music.player;
  const connection = music.connection;

  player.play(resource);
  connection.subscribe(player);
}
