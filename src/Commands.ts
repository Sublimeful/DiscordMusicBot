import Play from "./commands/music/Play.ts";
import Queue from "./commands/music/Queue.ts";
import Skip from "./commands/music/Skip.ts";

export const Commands = [Play, Skip, Queue]
export const CommandsMap = new Map<string, any>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
