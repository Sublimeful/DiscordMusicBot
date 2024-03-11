import { Readable } from "stream";
import { exec } from "../../../yt-dlp-utils/index.js";

export function getStream(url: string): Promise<Readable> {
  return new Promise((resolve, reject) => {
    const stream = exec(
      url,
      {
        output: "-",
        quiet: true,
        format: "bestaudio",
      },
      {
        stdio: ["ignore", "pipe", "ignore"],
      },
    );

    if (!stream.stdout) {
      reject(Error("Unable to retrieve audio data from the URL."));
    }

    void stream.on("spawn", () => {
      resolve(stream.stdout!);
    });
  });
}
