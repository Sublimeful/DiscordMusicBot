import { Song } from "./Song.ts";

export default class ServerQueue {
  public songs: Song[];
  public currentIndex: number;

  public get currentSong(): Song | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.songs.length) {
      return this.songs[this.currentIndex];
    }
    return null;
  }

  public constructor() {
    this.songs = [];
    this.currentIndex = -1;
  }

  public enqueue(songs: Song[]) {
    this.songs = this.songs.concat(songs);
  }

  public nextSong(): Song | null {
    if (this.currentIndex === -1) {
      // If the state of the music player is EOF, then
      // the next song should not be the first song
      return null;
    }

    // The last song has been played
    if (this.currentIndex + 1 >= this.length) {
      this.endSession();
      return null;
    }
    return this.songs[++this.currentIndex];
  }

  public jumpSong(n: number): Song | null {
    if (n >= this.length || n < 0) return null;
    return this.songs[(this.currentIndex = n)];
  }

  public get length() {
    return this.songs.length;
  }

  public remove(from: number, to = from): Song[] {
    if (this.currentIndex >= from && this.currentIndex <= to) {
      this.currentIndex = from - 1;
    } else if (to < this.currentIndex) {
      this.currentIndex -= to - from + 1;
    }
    return this.songs.splice(from, to - from + 1);
  }

  /**
   * Clears the queue, does not automatically enter EOF state
   * @returns void
   */
  public clear() {
    this.songs = [];
  }

  /**
   * Ends the current music session
   * @returns void
   */
  public endSession() {
    this.currentIndex = -1; // EOF state: when there is nothing more to be played
  }
}
