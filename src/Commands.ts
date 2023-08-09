import Play from "./commands/music/Play";

export const Commands = [Play]
export const CommandsMap = new Map<string, any>();

for(const cmd of Commands) {
  CommandsMap.set(cmd.data.name, cmd);
}
