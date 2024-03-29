import Debug from "../../../structures/Debug.ts";
import { Song, YTSong } from "../../../structures/Song.ts";
import { playlist_info, search, validate, video_basic_info } from "play-dl";

export async function getSongsFromQuery(query: string): Promise<Song[]> {
  const queryType = await validate(query);
  const songs: Song[] = [];

  try {
    switch (queryType) {
      case "yt_video": {
        const info = await video_basic_info(query);
        const song = new YTSong(info.video_details);
        songs.push(song);
        break;
      }
      case "yt_playlist": {
        const playlist = await playlist_info(query, { incomplete: true });
        const allVideos = await playlist.all_videos();
        for (const video of allVideos) {
          const song = new YTSong(video);
          songs.push(song);
        }
        break;
      }
      default: {
        // Youtube search query
        const searchResults = await search(query, { limit: 1 });
        if (searchResults.length === 0) break; // No search results
        const info = await video_basic_info(searchResults[0].url);
        const song = new YTSong(info.video_details);
        songs.push(song);
        break;
      }
    }
  } catch (error) {
    Debug.error(error);
  }

  return songs;
}
