import { Song, YTSong } from "../../../structures/Song.ts";
import { video_basic_info } from "play-dl";

export async function getRelatedSongs(videoId: string): Promise<Song[]> {
  try {
    const nextResponse = (await (await fetch("https://music.youtube.com/youtubei/v1/next?prettyPrint=false", {
      "headers": {
        "content-type": "application/json",
      },
      "body": JSON.stringify(
        {
          "playlistId": `RDAMVM${videoId}`,
          "context": {"client": {"clientName": "WEB_REMIX", "clientVersion": "1.20240124.01.00"}},
        },
      ),
      "method": "POST",
    })).text());

    const matches = nextResponse.matchAll(/\"videoId\":\"(.*?)\"/g);

    const videoIds: Set<string> = new Set();
    for (const match of matches) {
      videoIds.add(match[1]);
    }

    const songs = [];
    for (const videoId of videoIds) {
      const info = (await video_basic_info(videoId)).video_details;
      songs.push(new YTSong(info));
    }

    return songs;
  } catch(err) {
    // There was an error while fetching, abort
    return [];
  }
}
