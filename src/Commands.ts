import Play from "./commands/music/Play";

import Command from "./structures/Command";

export const Commands = [Play]
export const CommandsMap = new Map<string, Command>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
