import { Type } from "@sinclair/typebox";
import { app } from "..";
import downloader from "../downloader";
import { clientError } from "../utils/utils";

app.route({
    method: "GET",
    url: "/download/status",

    schema: {
        querystring: Type.Object({
            id: Type.String()
        })
    },

    handler: (req, res) => {
        const download = downloader.getDownload(req.query.id);
        if(!download)
            return clientError(res, "Invalid ID");

        res.send({
            success: true,
            status: download.status,
            progress: download.progress,
            error: download.error
        });
    }
});