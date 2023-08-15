import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnection, createAudioPlayer } from "@discordjs/voice";
import ServerQueue from "./ServerQueue.ts";
import Song from "./Song.ts";
import { play } from "../utils/functions/Music.ts";


export default class ServerMusic {
  public queue: ServerQueue;
  public readonly player: AudioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });
  public connection: VoiceConnection | null = null;
  public currentState: AudioPlayerStatus;
  public previousState: AudioPlayerStatus;

  public enqueue(songs: Song[]) {
    this.queue.enqueue(songs);
  }

  public nextSong() {
    return this.queue.nextSong();
  }

  public constructor() {
    this.queue = new ServerQueue();
    this.currentState = this.player.state.status;
    this.previousState = this.player.state.status;
    this.player.on("stateChange", (oldState, newState) => {
      console.log(`Player has changed state from ${oldState.status} to ${newState.status}`);
      this.currentState = newState.status;
      this.previousState = oldState.status;
      if (newState.status === "playing" && oldState.status !== "paused") {
        // New song started playing
        // TODO: Add notification about new song playing
      } else if (newState.status === "idle") {
        const newSong = this.nextSong();
        if (newSong) play(this, newSong);
      }
    })
    this.player.on("error", error => {
      console.error(error)
    })
  }
}

