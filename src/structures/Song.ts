import { SoundCloudStream, YouTubeStream, YouTubeVideo, stream, video_basic_info } from "play-dl";
import { getSongsFromQuery } from "../utils/functions/music/getSongsFromQuery";

export abstract class Song {
  public constructor(protected info: YouTubeVideo) {}

  public abstract get title(): (string | undefined);

  public abstract get url(): string;

  public abstract toString(): string;

  public abstract getRelatedSongs(limit?: number, queue?: Set<string>): Promise<Song[]>;

  public async getStream() : Promise<YouTubeStream | SoundCloudStream> {
    return stream(this.url);
  }
}

export class YTSong extends Song {
  public get title() {
    return this.info.title;
  }

  public get url() {
    return this.info.url;
  }

  public async getRelatedSongs(limit = 5, queue = new Set<string>()): Promise<Song[]> {
    const videoInfo = await video_basic_info(this.url);
    const relatedSongs: Song[] = [];
    for (const songURL of videoInfo.related_videos) {
      if (queue.has(songURL)) continue;  // No duplicates in queue
      const songs = await getSongsFromQuery(songURL);
      for (const song of songs) {
        relatedSongs.push(song);
        // Early return if we hit limit of songs
        if (--limit === 0) return relatedSongs;
      }
    }
    return relatedSongs;
  }

  public constructor(info: YouTubeVideo) {
    super(info);
  }

  public toString(): string {
    return `
New Song:
  URL: ${this.url}
  Title: ${this.title}
    `;
  }
}
