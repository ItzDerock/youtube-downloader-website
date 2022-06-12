import { existsSync, readdirSync, rmdirSync } from "fs";
import path from "path";
import { EventEmitter } from "stream";
import logger from "./utils/logger";
import { makeTempFolder } from "./utils/utils";
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
            '--remux-video', format,
            // '-o', this.output,
        ], {
            cwd: tempFolder.path,
        });

        this.progress = 0;

        this.events.on('progress', (progress: {
            percent: string,
            totalSize: string,
            currentSpeed: string,
            eta: string
        }) => {
            this.progress = parseInt(progress.percent);
        }).on('close', () => {
            this.finished = true;
            this.status = 'FINISHED';
        }).on('error', (error: string) => {
            logger.downloader.error(`Failed to download ${this.url} (${this.id}): `, error);
            
            this.error = error;
            this.status = 'ERROR';
            this.finished = true; 
        }).on('ytDlpEvent', (eventType: string, eventData: string) => {
            if(eventType === "download") {
                const data = eventData.split(':').map(e => e.trim());
                if(data[0] !== "Destination") return;
                if(!data[1].includes(format)) return;

                this.output = path.resolve(tempFolder.path, data[1]);
            } else if(eventType === "Merger") {
                if(!eventData.includes("Merging formats into")) return;

                const data = eventData.match(/"([^"]+)"/);
                if(!data) return;

                this.output = path.resolve(tempFolder.path, data[1] ?? data[0]);
            }
        });
    }

    cleanup() {
        rmdirSync(path.join(this.output, '..'), { recursive: true });
    }

    getOutput() {
        if(existsSync(this.output)) return this.output;

        const files = readdirSync(path.join(this.output, '..'))
            
        if(files.length === 0) return null;
        if(files.length === 1) return path.join(this.output, '..', files[0]);

        const found = files.find(f => f.includes(this.format));
        if(!found) return null;

        return path.join(this.output, '..', found);
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