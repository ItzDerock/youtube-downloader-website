import { Type } from "@sinclair/typebox";
import { statSync, createReadStream } from "fs";
import path from "path";
import { app } from "..";
import downloader from "../downloader";
import { clientError } from "../utils/utils";

app.route({
    method: "GET",
    url: "/download/download",

    schema: {
        querystring: Type.Object({
            id: Type.String()
        })
    },

    handler: (req, res) => {
        const download = downloader.getDownload(req.query.id);
        if(!download)
            return clientError(res, "Invalid ID");

        if(download.status !== 'FINISHED')
            return clientError(res, "Download not finished");

        const filepath = download.getOutput();

        if(!filepath)
            return clientError(res, "Download not finished or failed");

        const fileDetails = statSync(filepath);

        res.header("Content-Disposition", `attachment; filename="${path.basename(filepath)}"`);
        res.header("Content-Type", "video/" + download.format);
        res.header("Content-Length", fileDetails.size);

        res.send(createReadStream(filepath));
    }
});