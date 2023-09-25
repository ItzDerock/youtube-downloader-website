import fastify from "fastify";
import { readdirSync, statSync } from "fs";
import path from "path";
import * as color from "colorette";
import logger from "./utils/logger";
import config from "./utils/config";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

export const app = fastify()
  .withTypeProvider<ZodTypeProvider>()
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler);

app.register(await import("@fastify/cors"), {
  origin: "*",
});

const routes = path.join(__dirname, "./routes");

async function loaddir(dir: string) {
  const files = readdirSync(dir);

  for (const file of files) {
    const fullpath = path.join(dir, file);

    const stat = statSync(fullpath);
    if (stat.isDirectory()) {
      loaddir(fullpath);
    }

    if (file.endsWith(".ts") || file.endsWith(".js")) {
      logger.debug(
        `Loading route ${color.blue(path.relative(routes, fullpath))}`
      );
      await import(fullpath);
    }
  }
}

await loaddir(routes);

app
  .listen({
    port: config.port,
    host: config.host,
  })
  .then((d) => {
    logger.info(`Server listening on ${color.blue(d)}`);
  });
