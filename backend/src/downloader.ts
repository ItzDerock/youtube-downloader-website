import path from "path";
import { EventEmitter } from "stream";
import { makeTempFolder } from "./utils";
import ytdlp from "./ytdlp";

export class Download {
    url: string
    events: EventEmitter;
    output: string;
    id: string;

    progress: number;

    constructor(url: string, format: string, quality: string) {
        this.url = url;
        
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
            // percent:  
        }) => {

        })
    }
}

export class Downloader {
    #downloads = new Map<string, Download>();
}