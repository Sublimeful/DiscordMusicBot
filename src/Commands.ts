import Clear from "./commands/music/Clear.ts";
import Jump from "./commands/music/Jump.ts";
import NowPlaying from "./commands/music/NowPlaying.ts";
import Pause from "./commands/music/Pause.ts";
import Play from "./commands/music/Play.ts";
import Queue from "./commands/music/Queue.ts";
import Remove from "./commands/music/Remove.ts";
import Resume from "./commands/music/Resume.ts";
import Skip from "./commands/music/Skip.ts";
import Stop from "./commands/music/Stop.ts";
import Radio from "./commands/music/Radio.ts";

export const Commands = [Play, Skip, Queue, Jump, Pause, Resume, Stop, Clear, NowPlaying, Remove, Radio]
export const CommandsMap = new Map<string, any>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
