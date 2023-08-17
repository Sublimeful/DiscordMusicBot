import ServerMusic from "../structures/ServerMusic";
import { TextBasedChannel } from "discord.js";
import { MessageType, createEmbed } from "../utils/Message";

export default (music: ServerMusic, textChannel: TextBasedChannel): void => {
  music.player.on("stateChange", (oldState, newState) => {
      if (newState.status === "playing" && oldState.status !== "paused") {
        // New song started playing
        const message = `Playing: ${music.currentSong?.title}`;
        const embed = createEmbed(MessageType.info, message);
        textChannel.send({ embeds: [embed] });
      }
  })
}
