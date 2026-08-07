import pino, { LoggerOptions } from 'pino';
import { loadEnv } from './env.js';

const env = loadEnv();

const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL
};

if (env.NODE_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss'
    }
  };
}

export const logger = pino(loggerOptions);
