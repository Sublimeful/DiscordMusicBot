import { StageChannel, VoiceChannel } from "discord.js";
import { Client, VoiceState } from "discord.js";
import { MessageType, createEmbed } from "../utils/Message";

export default (client: Client): void => {
  client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    const music = newState.guild.music;
    if (!music) return;
    const newVC = newState.channel;
    const oldVC = oldState.channel;
    const newID = newVC?.id;
    const oldID = oldVC?.id;
    const queueVC = newState.guild.channels.cache.get(music.connection!.joinConfig.channelId!)! as
        | StageChannel
        | VoiceChannel;
    const member = newState.member;
    const oldMember = oldState.member;
    const newVCMembers = newVC?.members.filter(m => !m.user.bot);
    const queueVCMembers = queueVC.members.filter(m => !m.user.bot);
    const botID = client.user?.id;

    // Disconnected from voice channel
    if (oldMember?.id === botID && oldID === queueVC.id && newID === undefined) { 
      const isIdle = music.currentState === "idle"
      music.destroy();

      if (!isIdle) {
        const message = `Disconnected from the voice channel, the queue has been deleted`;
        const embed = createEmbed(MessageType.info, message);
        music.textChannel.send({ embeds: [embed] });
      }
    }
  });
};
