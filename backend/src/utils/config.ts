import { config as dotenv } from 'dotenv';
dotenv();

import path from "path";
import os from 'os';
import { LogLevel } from 'bunyan';

const prod = process.env.NODE_ENV === "production";

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
    tempDir: process.env.TEMP_DIR ?? os.tmpdir()
}

export default config;