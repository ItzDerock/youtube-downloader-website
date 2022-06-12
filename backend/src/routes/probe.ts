import { Type } from "@sinclair/typebox";
import { app } from "..";
import { Info } from "../types/ytdlp";
import { clientError, youtubeRegex } from "../utils/utils";
import ytdlp from "../ytdlp";

app.route({
    method: "POST",
    url: "/download/probe",

    schema: {
        body: Type.String()
    },
    
    handler: async (req, res) => {
        if(!youtubeRegex.test(req.body))
            return clientError(res, "Invalid URL");

        const info = (await ytdlp.getVideoInfo(req.body)) as Info;
        
        res.send({
            success: true,
            info: {
                formats: info.formats
            }
        });
    }
});