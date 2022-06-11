import { FastifyReply } from "fastify";
import os from 'os';
import path from 'path';
import fs from 'fs';

export function clientError(response: FastifyReply, error: string) {
    response.status(400).send({
        success: false,
        error
    });
}

export function makeId(length: number) {
    return Math.random().toString(36).substr(2, length);
}

export function makeTempFolder(): { path: string, id: string } {
    const tempFolder = os.tmpdir();
    const id = makeId(10);
    const folder = path.resolve(tempFolder, id);

    if(fs.existsSync(folder))
        return makeTempFolder();

    fs.mkdirSync(folder);
    return {
        path: folder,
        id
    };
}