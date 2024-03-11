import { YouTubeVideo } from "play-dl";
import { getStream } from "../utils/functions/music/getStream.ts";
import prism from "prism-media";

export abstract class Song {
  public constructor(protected info: YouTubeVideo) {}

  public abstract get title(): string | undefined;

  public abstract get url(): string;

  public abstract get id(): string;

  public abstract toString(): string;

  public async getStream() {
    const stream = new prism.FFmpeg({
      args: [
        "-loglevel",
        "0",
        "-ar",
        "48000",
        "-ac",
        "2",
        "-f",
        "opus",
        "-acodec",
        "libopus",
      ],
    });
    (await getStream(this.url)).pipe(stream);
    return stream;
  }
}

export class YTSong extends Song {
  public get title() {
    return this.info.title;
  }

  public get url() {
    return this.info.url;
  }

  public get id() {
    return this.info.id || this.url;
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
