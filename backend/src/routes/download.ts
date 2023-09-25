import { statSync, createReadStream } from "fs";
import path from "path";
import { app } from "..";
import downloader from "../downloader";
import { clientError } from "../utils/utils";
import z from "zod";

app.route({
  method: "GET",
  url: "/download/download",

  schema: {
    querystring: z.object({
      id: z.string(),
    }),
  },

  handler: (req, res) => {
    const download = downloader.getDownload(req.query.id);
    if (!download) return clientError(res, "Invalid ID");

    if (download.status !== "FINISHED")
      return clientError(res, "Download not finished");

    const filepath = download.getOutput();

    if (!filepath) return clientError(res, "Download not finished or failed");

    const fileDetails = statSync(filepath);
    const filename = path.basename(filepath).replace(/[^a-zA-Z0-9.]/g, "");

    res.header("Content-Disposition", `attachment;filename="${filename}"`);
    res.header("Content-Type", "video/" + download.format);
    res.header("Content-Length", fileDetails.size);

    res.send(createReadStream(filepath));
  },
});
