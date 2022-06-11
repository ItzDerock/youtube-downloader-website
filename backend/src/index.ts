import { TypeBoxTypeProvider, ajvTypeBoxPlugin } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import fastify from 'fastify';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import downloader from './downloader';
import { clientError, makeTempFolder } from './utils';
import ytdlp from './ytdlp';

const youtubeRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);

export const app = fastify({
    ajv: {
        plugins: [ajvTypeBoxPlugin]
    }
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(require('@fastify/cors'), {
    origin: '*'
});

app.route({
    method: "POST",
    url: "/download/probe",

    schema: {
        body: Type.String()
    },
    
    handler: (req, res) => {
        if(!youtubeRegex.test(req.body))
            return clientError(res, "Invalid URL");

        ytdlp.getVideoInfo(req.body).then((info: any) => {
            res.send({
                success: true,
                info
            });
        });
    }
});

app.route({
    method: "POST",
    url: "/download/queue",

    schema: {
        body: Type.Object({
            url: Type.String(),
            format: Type.String(),
            quality: Type.String()
        })
    },

    handler: (req, res) => {
        if(!youtubeRegex.test(req.body?.url))
            return clientError(res, "Invalid URL");

        const data = downloader.queueDownload(req.body.url, req.body.format, req.body.quality);

        res.send({
            success: true,
            id: data.id
        });
    }
});

app.route({
    method: "GET",
    url: "/download/status",

    schema: {
        querystring: Type.Object({
            id: Type.String()
        })
    },

    handler: (req, res) => {
        const download = downloader.getDownload(req.query.id);
        if(!download)
            return clientError(res, "Invalid ID");

        res.send({
            success: true,
            status: download.status,
            progress: download.progress,
            error: download.error
        });
    }
});

app.route({
    method: "GET",
    url: "/download/download",

    schema: {
        querystring: Type.Object({
            id: Type.String()
        })
    },

    handler: (req, res) => {
        const download = downloader.getDownload(req.query.id);
        if(!download)
            return clientError(res, "Invalid ID");

        if(download.status !== 'FINISHED')
            return clientError(res, "Download not finished");

        const filepath = download.getOutput();

        if(!filepath)
            return clientError(res, "Download not finished or failed");

        res.header("Content-Disposition", `attachment; filename="${path.basename(filepath)}"`);
        res.header("Content-Type", "video/" + download.format);

        res.send(createReadStream(filepath));
    }
});

if(existsSync(path.resolve('../../frontend/build'))) {
    // serve static files from frontend
    app.register(require('@fastify/static'), {
        root: path.resolve('../../frontend/build'),
        prefix: '/'
    });
}

app.listen({
    port: parseInt(process.env.PORT ?? "8080"),
    host: process.env.HOST ?? "0.0.0.0"
}).then(d => {
    console.log(`Listening on ${d}`);
});