import { app } from "..";
import downloader from "../downloader";
import { clientError } from "../utils/utils";
import z from "zod";

app.route({
  method: "GET",
  url: "/download/status",

  schema: {
    querystring: z.object({
      id: z.string(),
    }),
  },

  handler: (req, res) => {
    const download = downloader.getDownload(req.query.id);
    if (!download) return clientError(res, "Invalid ID");

    res.send({
      success: true,
      status: download.status,
      progress: download.progress,
      error: download.error,
    });
  },
});
