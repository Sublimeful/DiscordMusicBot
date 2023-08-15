import { Song } from "./Song";

export default class ServerQueue {
  public songs: Song[];
  public currentIndex: number;

  public get currentSong() {
    if (this.currentIndex >= 0 &&
        this.currentIndex < this.songs.length) {
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

  public nextSong() {
    if (this.length === 0) {
      this.currentIndex = -1;
      return null
    }

    this.currentIndex = (this.currentIndex + 1) % this.length;

    return this.songs[this.currentIndex];
  }

  public get length() {
    return this.songs.length;
  }

  public clear() {
    this.songs = []
  }
}


