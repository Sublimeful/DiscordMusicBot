import { Client, VoiceState } from "discord.js";
import { MessageType, createEmbed } from "../utils/Message";

export default (client: Client): void => {
  client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    const music = newState.guild.music;
    if (!music) return;
    const oldVC = oldState.channel;
    const newVC = newState.channel;
    // Disconnected from voice channel
    if (oldVC && !newVC) {
      music.destroy();
      const message = `Disconnected from the voice channel, the queue has been deleted`;
      const embed = createEmbed(MessageType.info, message);
      music.textChannel.send({ embeds: [embed] });
    }
  });
};
