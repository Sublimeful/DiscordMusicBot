import { InfoData, SoundCloudStream, YouTubeStream, YouTubeVideo, stream, stream_from_info } from "play-dl";

export abstract class Song {
  public constructor(protected info: YouTubeVideo) {}

  public abstract get title(): (string | undefined);

  public abstract get url(): string;

  public abstract toString(): string;

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
