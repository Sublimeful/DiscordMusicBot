import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnection, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import ServerQueue from "./ServerQueue.ts";
import { Song } from "./Song.ts";
import Debug from "./Debug.ts";
import { TextChannel } from "discord.js";
import { MessageType, createEmbed } from "../utils/Message.ts";

interface ServerMusicOptions {
  radio: boolean
}

export default class ServerMusic {
  public readonly queue: ServerQueue = new ServerQueue();
  public readonly player: AudioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });
  public connection: VoiceConnection | null = null;
  public currentState: AudioPlayerStatus;
  public previousState: AudioPlayerStatus;
  public options: ServerMusicOptions = { radio: true };

  public get songs(): Song[] {
    return this.queue.songs;
  }

  public get currentIndex(): number {
    return this.queue.currentIndex;
  }

  public get currentSong(): Song | null {
    return this.queue.currentSong;
  }

  public get radio() {
    return this.options.radio;
  }

  public set radio(v: boolean) {
    this.options.radio = v;
  }

  public enqueue(songs: Song[]) {
    this.queue.enqueue(songs);
  }

  /**
   * Removes songs in range 'from' to 'to' inclusive, if currently playing song is part
   * of removed songs, then try to play the next song after removal
   * @returns removed songs
   */
  public remove(from: number, to = from) {
    const removedSongs = this.queue.remove(from, to);
    // Try to play next song after removal,
    // If there is no next song, then player will enter EOF state
    this.skipSong();
    return removedSongs;
  }

  /**
   * Clears queue, enter EOF and stops playback
   * @returns void
   */
  public clear() {
    this.queue.clear();
    this.stop();
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
    if (newSong)
      this.play(newSong);
    else
      this.stop();
    return skippedSong;
  }
  
  /**
   * Stops all playback
   * @returns null
   */
  public stop() {
    this.player.pause();
    this.player.stop();
  }

  /**
   * Immediately plays a song
   * @returns null
   */
  public async play(song: Song) {
    // This shouldn't happen! Play should always be called when bot is connected to a VC
    if (!this.connection) {
      return Debug.error("'play' function called when the bot is not connected to a voice channel!");
    }

    const stream = await song.getStream();
    const resource = createAudioResource(stream.stream, { inputType: stream.type });

    this.player.play(resource);
    this.connection.subscribe(this.player);
  }

  public pause() {
    this.player.pause();
  }

  public resume() {
    this.player.unpause();
  }

  /**
   * Sets the queue's current index to n or length of the queue, whichever is lower,
   * and plays the songs at that index
   * @param n the index to set the index to
   * @returns skipped song, null if nothing was skipped
   **/
  public jumpSong(n: number) {
    const skippedSong = this.currentSong;
    const newSong = this.queue.jumpSong(n);
    if (newSong) this.play(newSong);
    return skippedSong;
  }

  public destroy() {
    this.stop();
    this.connection?.disconnect();
    delete this.textChannel.guild.music;
  }

  public constructor(public readonly textChannel: TextChannel) {
    this.currentState = this.player.state.status;
    this.previousState = this.player.state.status;
    this.player.on("stateChange", (oldState, newState) => {
      this.currentState = newState.status;
      this.previousState = oldState.status;
      if (newState.status === "playing" && oldState.status !== "paused") {
        // New song started playing
        const newSong = this.currentSong!;
        const message = `Playing: ${newSong.title}`;
        const embed = createEmbed(MessageType.info, message);
        textChannel.send({ embeds: [embed] });

        // If radio mode is on, then add related songs to queue
        if (this.radio) {
          const myUniqueQueue: Set<string> = new Set();
          for (const song of this.songs) {
            myUniqueQueue.add(song.url);
          }
          newSong.getRelatedSongs(5, myUniqueQueue)
            .then(songs => {
              this.enqueue(songs);
              const message = `Added: ${songs.length} related songs`;
              const embed = createEmbed(MessageType.info, message);
              this.textChannel.send({ embeds: [embed] });
            });
        }
      } else if (newState.status === "idle") {
        this.skipSong();
        if (this.currentIndex === -1) {
          const embed = createEmbed(MessageType.info, `Now at tail of queue`);
          this.textChannel.send({ embeds: [embed] });
        }
      }
    })
    this.player.on("error", error => {
      console.error(error)
    })
  }
}

