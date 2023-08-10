import CommandContext from "../../structures/CommandContext.ts";
import ServerQueue from "../../structures/ServerQueue.ts";
import Song from "../../structures/Song.ts";

export async function handleVideos(context: CommandContext, songs: Song[]) {
  if (!context.voiceChannel || !context.guild) return;

  if (!context.guild.queue) {
    context.guild.queue = new ServerQueue(songs);
  }

  const serverQueue: ServerQueue = context.guild.queue
  const currentSong = serverQueue.nextSong()
  console.log(currentSong)
  
}
