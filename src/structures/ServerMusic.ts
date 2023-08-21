import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnection, createAudioPlayer } from "@discordjs/voice";
import ServerQueue from "./ServerQueue.ts";
import { Song } from "./Song.ts";
import play from "../utils/functions/music/play.ts";


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

  public get currentSong(): Song | null {
    return this.queue.currentSong;
  }

  public enqueue(songs: Song[]) {
    this.queue.enqueue(songs);
  }

  /**
   * Gets the next song from the queue, this advances the queue's currentSong pointer
   * @returns next song in queue, null if there is none
   */
  public nextSong(): Song | null {
    return this.queue.nextSong();
  }

  /**
   * Skips current song and plays the next song
   * @returns skipped song, null if nothing was skipped
   */
  public skipSong() {
    const skippedSong = this.currentSong;
    const newSong = this.nextSong();
    if (newSong) play(this, newSong);
    return skippedSong;
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
      } else if (newState.status === "idle") {
        this.skipSong();
      }
    })
    this.player.on("error", error => {
      console.error(error)
    })
  }
}

