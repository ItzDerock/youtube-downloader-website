import { Type } from "@sinclair/typebox";
import { app } from "..";
import { Info } from "../types/ytdlp";
import config from "../utils/config";
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

        if((config.maxDownloadLength > -1) && (info.duration > config.maxDownloadLength)) 
            return clientError(res, `Video must be under ${config.maxHumanReadable}.`);
        
        res.send({
            success: true,
            info: {
                formats: info.formats
            }
        });
    }
});