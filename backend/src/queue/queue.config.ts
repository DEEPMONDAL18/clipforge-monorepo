import { RedisOptions } from 'ioredis';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

export const redisConnectionConfig: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  maxRetriesPerRequest: null
};
