import Debug from "./Debug.ts";
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
    if (this.currentIndex + 1 >= this.length) {
      this.currentIndex = -1; // EOF state: when there is nothing more to be played
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
    if (to < from) {
      Debug.error(`'remove' command: to < from`);
      return [];
    }
    if (to < 0 || to >= this.length || from < 0 || from >= this.length) {
      Debug.error(`'remove' command: either from or to index out of range`);
      return [];
    }
    if (this.currentIndex >= from && this.currentIndex <= to) {
      this.currentIndex = from - 1;
    } else if (to < this.currentIndex) {
      this.currentIndex -= to - from + 1;
    }
    return this.songs.splice(from, to - from + 1);
  }

  public clear() {
    this.songs = [];
    this.currentIndex = -1;
  }
}
