import { FastifyReply } from "fastify";
import os from 'os';
import path from 'path';
import fs from 'fs';
import config from "./config";

export function clientError(response: FastifyReply, error: string, extras?: { [key: string]: any }) {
    response.status(400).send({
        success: false,
        error,
        ...(extras ?? {})
    });
}

export function makeId(length: number) {
    return Math.random().toString(36).substr(2, length);
}

export function makeTempFolder(): { path: string, id: string } {
    const tempFolder = config.tempDir;
    const id         = makeId(10);
    const folder     = path.resolve(tempFolder, `ytdpl-${id}`);

    if(fs.existsSync(folder))
        return makeTempFolder();

    fs.mkdirSync(folder);
    return {
        path: folder,
        id
    };
}

export const youtubeRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);