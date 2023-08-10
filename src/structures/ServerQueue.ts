import Song from "./Song.ts";

export default class ServerQueue {
  public Songs: Song[];
  public currentIndex: number;

  public constructor(songs: Song[]) {
    this.Songs = songs;
    this.currentIndex = -1;
  }

  public nextSong() {
    if (this.length === 0) {
      this.currentIndex = -1;
      return null
    }

    this.currentIndex = (this.currentIndex + 1) % this.length;

    return this.Songs[this.currentIndex];
  }

  public get length() {
    return this.Songs.length;
  }
}


