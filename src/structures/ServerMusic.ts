import {
  AudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
} from "@discordjs/voice";
import ServerQueue from "./ServerQueue.ts";
import { Song } from "./Song.ts";
import Debug from "./Debug.ts";
import { TextChannel } from "discord.js";
import { MessageType, createEmbed } from "../utils/Message.ts";
import { getRelatedSongs } from "../utils/functions/music/getRelatedSongs.ts";

interface ServerMusicOptions {
  radio: {
    isOn: boolean;
    relatedSongsLimit: number;
    relatedSongsRandomness: number;
    suggestUniqueSongs: boolean;
  };
}

export default class ServerMusic {
  public readonly queue: ServerQueue = new ServerQueue();
  public readonly player: AudioPlayer = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
  });
  public connection: VoiceConnection | null = null;
  public currentState: AudioPlayerStatus;
  public previousState: AudioPlayerStatus;
  public options: ServerMusicOptions = {
    radio: {
      isOn: false,
      relatedSongsLimit: 1,
      relatedSongsRandomness: 1,
      suggestUniqueSongs: true,
    },
  };

  public get songs(): Song[] {
    return this.queue.songs;
  }

  public get currentIndex(): number {
    return this.queue.currentIndex;
  }

  public get currentSong(): Song | null {
    return this.queue.currentSong;
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
    const currentSongIsRemoved =
      this.currentIndex >= from && this.currentIndex <= to;
    const removedSongs = this.queue.remove(from, to);
    // Try to play next song if the current song is part of removed songs,
    // If there is no next song, then player will enter EOF state
    if (currentSongIsRemoved) this.skipSong();
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

    if (newSong) {
      this.play(newSong);
    } else {
      this.stop();
    }

    return skippedSong;
  }

  /**
   * Stops all playback
   * @returns null
   */
  public stop() {
    this.player.stop(true);
    this.queue.endSession();
  }

  /**
   * Immediately plays a song
   * @returns null
   */
  public play(song: Song) {
    // This shouldn't happen! Play should always be called when bot is connected to a VC
    if (!this.connection) {
      return Debug.error(
        "'play' function called when the bot is not connected to a voice channel!",
      );
    }

    song.getStream().then((stream) => {
      const resource = createAudioResource(stream, {
        inlineVolume: true,
        inputType: StreamType.OggOpus,
        metadata: song,
      });

      if (this.connection) {
        this.connection.subscribe(this.player);
        this.player.play(resource);
      }
    });
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
   * @returns void
   **/
  public jumpSong(n: number) {
    const newSong = this.queue.jumpSong(n);

    if (newSong) {
      this.play(newSong);
    }
  }

  public destroy() {
    this.connection?.disconnect();
    this.connection = null;
    this.clear();
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
        if (this.options.radio.isOn) {
          const filterList: Set<string> = new Set();
          if (this.options.radio.suggestUniqueSongs) {
            for (const song of this.songs) {
              filterList.add(song.id);
            }
          }
          getRelatedSongs(
            newSong,
            filterList,
            this.options.radio.relatedSongsLimit,
            this.options.radio.relatedSongsRandomness,
          ).then((songs) => {
            this.enqueue(songs);

            const message = `Added: ${songs.length} related songs`;
            const embed = createEmbed(MessageType.info, message);
            this.textChannel.send({ embeds: [embed] });
          });
        }
      } else if (newState.status === "idle") {
        if (this.currentIndex !== -1) {
          // If the state of the music player is EOF, then
          // autoskip should not move on to the first song
          this.skipSong();
        } else if (this.queue.length > 0) {
          // This message should not print when the user executes the Clear command
          const embed = createEmbed(MessageType.info, `Now at tail of queue`);
          this.textChannel.send({ embeds: [embed] });
        }
      }
    });
    this.player.on("error", (error) => {
      Debug.error(error);
    });
  }
}
