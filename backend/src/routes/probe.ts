import { Type } from "@sinclair/typebox";
import { app } from "..";
import { clientError, youtubeRegex } from "../utils/utils";
import ytdlp from "../ytdlp";

app.route({
    method: "POST",
    url: "/download/probe",

    schema: {
        body: Type.String()
    },
    
    handler: (req, res) => {
        if(!youtubeRegex.test(req.body))
            return clientError(res, "Invalid URL");

        ytdlp.getVideoInfo(req.body).then((info: any) => {
            res.send({
                success: true,
                info
            });
        });
    }
});