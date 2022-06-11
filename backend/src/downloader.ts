import { rmdirSync } from "fs";
import path from "path";
import { EventEmitter } from "stream";
import { makeTempFolder } from "./utils";
import ytdlp from "./ytdlp";

export class Download {
    url: string
    events: EventEmitter;
    output: string;
    id: string;
    format: string;
    quality: string;

    progress: number;
    finished: boolean = false;
    status: 'IN_PROGRESS' | 'FINISHED' | "ERROR" = 'IN_PROGRESS';

    error?: string;

    createdAt: Date = new Date();

    constructor(url: string, format: string, quality: string) {
        format = format.toLowerCase();

        this.url = url;
        this.format = format;
        this.quality = quality;
        
        const tempFolder = makeTempFolder();
        this.id = tempFolder.id;
        this.output = path.resolve(tempFolder.path, `${this.id}.${format}`); 
        
        this.events = ytdlp.exec([
            url,
            '-f', quality,
            '-S', 'res,ext:mp4:m4a',
            '--recode', format,
            '-o', this.output,
        ]);

        this.progress = 0;

        this.events.on('progress', (progress: {
            percent: string,
            totalSize: string,
            currentSpeed: string,
            eta: string
        }) => {
            console.log(progress);
            this.progress = parseInt(progress.percent);
        }).on('close', () => {
            this.finished = true;
            this.status = 'FINISHED';
        }).on('error', (error: string) => {
            this.error = error;
            this.status = 'ERROR';
            this.finished = true; 
        });
    }

    cleanup() {
        rmdirSync(path.join(this.output, '..'), { recursive: true });
    }
}

export class Downloader {
    #downloads = new Map<string, Download>();

    constructor() {
        setInterval(() => {
            this.#downloads.forEach((download) => {
                // delete finished downloads over an hour old
                if (download.finished && (download.createdAt.getTime() + 3600000 < new Date().getTime())) {
                    download.cleanup();
                    this.#downloads.delete(download.id);
                }
            });
        }, 5000);
    }

    queueDownload(url: string, format: string, quality: string) {
        const download = new Download(url, format, quality);
        this.#downloads.set(download.id, download);
        return download;
    }

    getDownload(id: string) {
        return this.#downloads.get(id);
    }
}

export default new Downloader();