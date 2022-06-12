import { existsSync, readFileSync } from "fs";
import path from "path";
import { app } from "..";

const frontendPath = process.env.FRONTEND_PATH ?? path.join(__dirname, "../../../frontend/build");

console.log(`Checking for built frontend files in ${frontendPath}`);
if(existsSync(frontendPath)) {
    console.log("Serving frontend from build folder");

    // serve static files from frontend
    app.register(require('@fastify/static'), {
        root: frontendPath,
        prefix: '/',
    });

    const index = readFileSync(path.resolve(frontendPath, 'index.html'));

    app.setNotFoundHandler((req, res) => {
        res.send(index);
    });
}