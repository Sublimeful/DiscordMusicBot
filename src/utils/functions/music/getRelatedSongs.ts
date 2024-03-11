import { Song, YTSong } from "../../../structures/Song.ts";
import { video_basic_info } from "play-dl";

async function getRelatedSongsYT(song: YTSong, videoIdFilterList: Set<String> = new Set(), limit: number = 1, randomness: number = 1): Promise<Song[]> {
  try {
    const nextResponse = (await (await fetch("https://music.youtube.com/youtubei/v1/next?prettyPrint=false", {
      "headers": {
        "content-type": "application/json",
      },
      "body": JSON.stringify(
        {
          "playlistId": `RDAMVM${song.id}`,
          "context": {"client": {"clientName": "WEB_REMIX", "clientVersion": "1.20240124.01.00"}},
        },
      ),
      "method": "POST",
    })).text());

    const matches = nextResponse.matchAll(/\"videoId\":\"(.*?)\"/g)

    let videoIds: string[] = Array.from(matches).map(match => match[1]);  // Extracting videoIds from the regex groups
    videoIds = Array.from(new Set(videoIds));  // Removing duplicate video ids
    videoIds = videoIds.filter(id => !(videoIdFilterList.has(id)));  // Filtering out videos present in the filter list

    // Shuffling the videoIds array
    // Randomness determines the upper bounds of our shuffling
    for (let i = Math.min(randomness, videoIds.length) - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [videoIds[i], videoIds[j]] = [videoIds[j], videoIds[i]];
    }

    videoIds = videoIds.slice(0, limit);  // Get first (limit) videos

    // Convert videoIds to YTSongs
    return await Promise.all(videoIds.map(async id => new YTSong((await video_basic_info(id)).video_details)));
  } catch(err) {
    // There was an error while fetching, abort
    return [];
  }
}

export async function getRelatedSongs(song: Song, videoIdFilterList: Set<string> = new Set(), limit: number = 1, randomness: number = 1): Promise<Song[]> {
  if (song instanceof YTSong) {
    return await getRelatedSongsYT(song, videoIdFilterList, limit, randomness);
  }

  return [];
}
