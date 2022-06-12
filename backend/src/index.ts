import { TypeBoxTypeProvider, ajvTypeBoxPlugin } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import { readdirSync, statSync } from 'fs';
import path from 'path';

import { config } from 'dotenv';
config();

export const app = fastify({
    ajv: {
        plugins: [ajvTypeBoxPlugin]
    }
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(require('@fastify/cors'), {
    origin: '*'
});

const routes = path.join(__dirname, "./routes");

function loaddir(dir: string) {
    const files = readdirSync(dir);

    for(const file of files) {
        const fullpath = path.join(dir, file);

        const stat = statSync(fullpath);
        if(stat.isDirectory()) {
            loaddir(fullpath);
        }
        
        if(file.endsWith(".ts") || file.endsWith(".js")) {
            console.log(`Loading route ${path.relative(routes, fullpath)}`);
            require(fullpath);
        }
    }
}

loaddir(routes);

app.listen({
    port: parseInt(process.env.PORT ?? "8080"),
    host: process.env.HOST ?? "0.0.0.0"
}).then(d => {
    console.log(`Listening on ${d}`);
});