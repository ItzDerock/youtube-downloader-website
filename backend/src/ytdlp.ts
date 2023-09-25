import YTDlpWrap from "yt-dlp-wrap";
import logger from "./utils/logger";
import * as colors from "colorette";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

const target = path.join(os.tmpdir(), "ytdlp");
let version = "unknown";

/**
 * Installs the latest yt-dlp binary from GitHub
 */
async function updateYTDlp() {
  logger.ytdlp.info("Downloading yt-dlp binary to " + colors.blue(target));
  // await YTDlpWrap.downloadFromGithub(target); << BROKEN, never closes the file handle

  // find the latest release
  const releases = await YTDlpWrap.getGithubReleases(1, 1);
  const isWindows = os.platform() === "win32";
  const latestTag = releases[0].tag_name;

  if (latestTag === version) {
    logger.ytdlp.info("yt-dlp is up to date!");
    return;
  }

  const latest = `https://github.com/yt-dlp/yt-dlp/releases/download/${latestTag}/yt-dlp${
    isWindows ? ".exe" : ""
  }`;

  logger.ytdlp.debug("Latest release: " + colors.blue(latest));

  // download the binary
  const response = await fetch(latest);
  const file = Bun.file(target);
  const writer = file.writer();
  writer.write(await response.arrayBuffer());
  await writer.flush();
  await writer.end();

  // chmod +x to the binary
  logger.ytdlp.info("Setting permissions to binary...");
  await fs.chmod(target, 0o755);
  logger.ytdlp.info("yt-dlp binary downloaded!");
}

await updateYTDlp();
setInterval(() => updateYTDlp(), 1000 * 60 * 60 * 24); // update yt-dlp every 24 hours

export default new YTDlpWrap(target);
