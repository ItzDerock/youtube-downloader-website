import { Type } from "@sinclair/typebox";
import { app } from "..";
import downloader from "../downloader";
import { youtubeRegex, clientError } from "../utils";

app.route({
    method: "POST",
    url: "/download/queue",

    schema: {
        body: Type.Object({
            url: Type.String(),
            format: Type.String(),
            quality: Type.String()
        })
    },

    handler: (req, res) => {
        if(!youtubeRegex.test(req.body?.url))
            return clientError(res, "Invalid URL");

        const data = downloader.queueDownload(req.body.url, req.body.format, req.body.quality);

        res.send({
            success: true,
            id: data.id
        });
    }
});