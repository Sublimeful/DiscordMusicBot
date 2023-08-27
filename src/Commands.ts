import Play from "./commands/music/Play.ts";
import Queue from "./commands/music/Queue.ts";
import Skip from "./commands/music/Skip.ts";
import Jump from "./commands/music/Jump.ts";

export const Commands = [Play, Skip, Queue, Jump]
export const CommandsMap = new Map<string, any>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
