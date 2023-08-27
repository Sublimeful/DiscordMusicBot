import { ChatInputCommandInteraction } from "discord.js";

export default class CommandContext {
  public guild;
  public member;

  public constructor(public interaction: ChatInputCommandInteraction) {
    this.guild = interaction.guild;
    this.member = interaction.member;
  }

  public get voiceChannel() {
    const member = this.guild!.members.cache.get(this.member!.user.id);
    const voiceChannel = member!.voice.channel;

    return voiceChannel;
  }
}
