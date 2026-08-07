import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

export async function registerSecurityMiddleware(app: FastifyInstance): Promise<void> {
  // Security Headers (Helmet)
  await app.register(helmet, {
    contentSecurityPolicy: app.config.NODE_ENV === 'production'
  });

  // CORS Configuration
  await app.register(cors, {
    origin: app.config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  });

  // Compression
  await app.register(compress, {
    global: true,
    threshold: 1024
  });

  // Rate Limiting
  await app.register(rateLimit, {
    max: app.config.RATE_LIMIT_MAX_REQUESTS,
    timeWindow: app.config.RATE_LIMIT_WINDOW_MS
  });
}
