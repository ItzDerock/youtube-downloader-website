import { TypeBoxTypeProvider, ajvTypeBoxPlugin } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import fastify from 'fastify';
import { clientError, makeTempFolder } from './utils';
import ytdlp from './ytdlp';

const youtubeRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);

export const app = fastify({
    ajv: {
        plugins: [ajvTypeBoxPlugin]
    }
}).withTypeProvider<TypeBoxTypeProvider>();

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
        })
    },

    handler: (req, res) => {
        if(!youtubeRegex.test(req.body?.url))
            return clientError(res, "Invalid URL");

    }
})

app.listen({
    port: parseInt(process.env.PORT ?? "8080")
});