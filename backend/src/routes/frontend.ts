import { existsSync, readFileSync } from "fs";
import path from "path";
import { app } from "..";
import logger from "../utils/logger";
import * as color from 'colorette';

const frontendPath = process.env.FRONTEND_PATH ?? path.join(__dirname, "../../../frontend/build");

logger.frontend.debug(`Checking for frontend files at ${color.blue(frontendPath)}`);
if(existsSync(frontendPath)) {
    logger.frontend.info(`Frontend files found! Serving them...`);

    // serve static files from frontend
    app.register(require('@fastify/static'), {
        root: frontendPath,
        prefix: '/',
    });

    const index = readFileSync(path.resolve(frontendPath, 'index.html'));

    app.setNotFoundHandler((_req, res) => {
        res.send(index);
    });
}