import Play from "./commands/music/Play.ts";

export const Commands = [Play]
export const CommandsMap = new Map<string, any>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
