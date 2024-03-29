import { app } from "..";
import downloader from "../downloader";
import { Info } from "../types/ytdlp";
import config from "../utils/config";
import { youtubeRegex, clientError } from "../utils/utils";
import ytdlp from "../ytdlp";
import z from "zod";

app.route({
  method: "POST",
  url: "/download/queue",

  schema: {
    body: z.object({
      url: z.string(),
      format: z.string(),
      quality: z.string(),
    }),
  },

  handler: async (req, res) => {
    if (!youtubeRegex.test(req.body?.url))
      return clientError(res, "Invalid URL");

    const info = (await ytdlp
      .getVideoInfo(req.body.url)
      .catch((err) => null)) as Info | null;

    if (!info) return clientError(res, "Invalid URL");

    if (
      config.maxDownloadLength > -1 &&
      info.duration > config.maxDownloadLength
    )
      return clientError(
        res,
        `Video must be under ${config.maxHumanReadable}.`
      );

    const data = downloader.queueDownload(
      req.body.url,
      req.body.format,
      req.body.quality
    );

    res.status(202).send({
      success: true,
      id: data.id,
    });
  },
});
