import { Song, YTSong } from "../../../structures/Song";
import { InfoData, playlist_info, search, validate, video_basic_info, video_info } from "play-dl";
import Debug from "../../../structures/Debug";

export async function getSongsFromQuery(query: string): Promise<Song[]> {
  const queryType = await validate(query);
  const songs: Song[] = [];

  switch (queryType) {
    case "yt_video": {
      const info = await video_basic_info(query);
      const song = new YTSong(info.video_details);
      songs.push(song);
      break;
    }
    case "yt_playlist": {
      const playlist = await playlist_info(query);
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
      const info = await video_basic_info(searchResults[0].url);
      const song = new YTSong(info.video_details);
      songs.push(song)
      break;
    }
  }

  return songs;
}
