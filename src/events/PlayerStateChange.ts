import ServerMusic from "../structures/ServerMusic";
import { TextBasedChannel } from "discord.js";

export default (music: ServerMusic, textChannel: TextBasedChannel): void => {
  music.player.on("stateChange", (oldState, newState) => {
      if (newState.status === "playing" && oldState.status !== "paused") {
        // New song started playing
        // TODO: Add notification about new song playing
      }
  })
}
