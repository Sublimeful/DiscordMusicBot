import CommandContext from "src/structures/CommandContext";
import ServerQueue from "src/structures/ServerQueue";

export async function handleVideos(context: CommandContext) {
  if (!context.voiceChannel || !context.guild) return;

  if (!context.guild.queue) {
    context.guild.queue = new ServerQueue();
  }








  
}
