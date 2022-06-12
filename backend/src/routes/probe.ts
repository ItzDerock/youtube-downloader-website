import { Type } from "@sinclair/typebox";
import { app } from "..";
import { Info } from "../types/ytdlp";
import cache from "../utils/cache";
import config from "../utils/config";
import logger from "../utils/logger";
import { clientError, youtubeRegex } from "../utils/utils";
import ytdlp from "../ytdlp";

app.route({
    method: "POST",
    url: "/download/probe",

    schema: {
        body: Type.String()
    },

    preHandler: (req, res, next) => {
        try {
            const url = new URL(req.body);
            const id  = url.searchParams.get("v");

            if(id && cache.has(id)) {
                res.header("X-Cache", "HIT");
                res.send(JSON.parse(cache.get(id)!));
                return;
            }
        } catch (error) {
            logger.error(`Caching fetch failed on probe`, error);
        } finally {
            next();
        }
    },

    onSend: (req, res, payload, next) => {
        console.log(res.getHeaders()["x-cache"]);

        if(res.getHeaders()["x-cache"] === "HIT") {
            return next();
        }

        try {
            const url = new URL(req.body);
            const id  = url.searchParams.get("v");
            if(id)
                cache.set(id, payload, 60 * 60);

            console.log('s', payload)
        } catch (error) {
            logger.error(`Caching failed on probe`, error);
        } finally {
            next();
        }
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
                formats: info.formats.map(data => {
                    delete data['http_headers'];
                    return data;
                })
            }
        });
    }
});