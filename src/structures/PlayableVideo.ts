import { InfoData, SoundCloudStream, YouTubeStream } from "play-dl";

export abstract class PlayableVideo {
  public constructor(protected videoStream: (YouTubeStream | SoundCloudStream),
                     protected info: InfoData) {}

  public abstract get title(): (string | undefined);

  public get streamType() {
    return this.videoStream.type;
  }
  public get stream() {
    return this.videoStream.stream;
  }
}

export class YTPlayableVideo extends PlayableVideo {
  public get title() {
    return this.info.video_details.title;
  }

  public constructor(videoStream: YouTubeStream, info: InfoData) {
    super(videoStream, info);
  }
}
