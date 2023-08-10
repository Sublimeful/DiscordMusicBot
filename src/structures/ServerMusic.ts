import { AudioPlayer, NoSubscriberBehavior, VoiceConnection, createAudioPlayer } from "@discordjs/voice";
import ServerQueue from "./ServerQueue.ts";
import Song from "./Song.ts";


export default class ServerMusic {
  public queue: ServerQueue;
  public readonly player: AudioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });
  public connection: VoiceConnection | null = null;

  public constructor(songs: Song[]) {
    this.queue = new ServerQueue(songs);
  }

}

