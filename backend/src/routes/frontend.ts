import { existsSync, readFileSync } from "fs";
import path from "path";
import { app } from "..";
import logger from "../utils/logger";
import * as color from 'colorette';
import config from "../utils/config";

logger.frontend.debug(`Checking for frontend files at ${color.blue(config.frontendPath)}`);
if(existsSync(config.frontendPath)) {
    logger.frontend.info(`Frontend files found! Serving them...`);

    // serve static files from frontend
    app.register(require('@fastify/static'), {
        root: config.frontendPath,
        prefix: '/',
    });

    const index = readFileSync(path.resolve(config.frontendPath, 'index.html'));

    app.setNotFoundHandler((_req, res) => {
        res.send(index);
    });
}