import { InfoData, SoundCloudStream, YouTubeStream, stream_from_info } from "play-dl";

export abstract class Song {
  public constructor(protected info: InfoData) {}

  public abstract get title(): (string | undefined);

  public async getStream() : Promise<YouTubeStream | SoundCloudStream> {
    return stream_from_info(this.info);
  }
}

export class YTSong extends Song {
  public get title() {
    return this.info.video_details.title;
  }

  public constructor(info: InfoData) {
    super(info);
  }
}
