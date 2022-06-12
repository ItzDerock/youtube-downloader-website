import { config as dotenv } from 'dotenv';
dotenv();

import path from "path";
import os from 'os';
import { LogLevel } from 'bunyan';
import { formatDuration, intervalToDuration } from 'date-fns';

const prod = process.env.NODE_ENV === "production";
const maxDownloadLength = parseInt(process.env.MAX_DOWNLOAD_LENGTH ?? "-1");

const config = {
    // General configuration
    prod,

    // Webserver configuration
    port: parseInt(process.env.PORT ?? "8080"),
    host: process.env.HOST ?? "0.0.0.0",
    
    // Frontend
    frontendPath: process.env.FRONTEND_PATH ?? path.join(__dirname, "../../../frontend/build"),

    // Logging
    logLevel: (process.env.LOG_LEVEL ?? (prod ? "info" : "debug")) as LogLevel,
    saveLogs: process.env.NO_LOGS === undefined,

    // yt-dlp
    maxDownloadLength, // in seconds
    maxHumanReadable: formatDuration(intervalToDuration({ start: 0, end: maxDownloadLength * 1000 })),
    tempDir: process.env.TEMP_DIR ?? os.tmpdir()
}

export default config;