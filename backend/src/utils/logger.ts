import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';
import config from './config';

// if in production, do not log debug messages
const streams: bunyan.Stream[] = [
    { level: config.logLevel, stream: bunyanFormat({ }) }
];

// option to disable logging to file
// useful if your app is running in a container with no mounted logs folder
if(config.saveLogs) {
    // ensure logs folder exists
    const fs = require('fs');
    if(!fs.existsSync('./logs')) 
        fs.mkdirSync('./logs');

    // log to file
    streams.push(
        { level: 'info', path: './logs/webserver.log' },
        { level: 'error', path: './logs/webserver.log' }
    );
}

// create a map to hold all the loggers
const loggers = new Map();

// the default logger
const defaultLogger = bunyan.createLogger({
    name: 'webserver',
    streams
});

// allows for "logger.downloader.info(...)" which will create a logger with the name "downloader"
const logger = new Proxy({}, {
    get: (_target, name) => {
        // @ts-ignore
        if(typeof defaultLogger[name] === 'function') 
            // @ts-ignore
            return defaultLogger[name].bind(defaultLogger);

        if(typeof name === "symbol")
            return;

        // check if logger already exists
        if(loggers.get(name)) 
            return loggers.get(name);

        // create a new logger
        const logger = bunyan.createLogger({
            name: name,
            streams
        });

        // add it to the map
        loggers.set(name, logger);

        // return the logger
        return logger;
    }
});

// and types
type Logger = {
    [key: string]: bunyan
} & bunyan

// export
export default logger as Logger;