import { TypeBoxTypeProvider, ajvTypeBoxPlugin } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import * as color from 'colorette'
import logger from './utils/logger';
import config from './utils/config';

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
            logger.debug(`Loading route ${color.blue(path.relative(routes, fullpath))}`);
            require(fullpath);
        }
    }
}

loaddir(routes);

app.listen({
    port: config.port,
    host: config.host
}).then(d => {
    logger.info(`Server listening on ${color.blue(d)}`);
});