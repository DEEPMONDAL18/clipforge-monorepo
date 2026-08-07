import { buildApp } from './app.js';
import { loadEnv } from './config/env.js';
import { logger } from './config/logger.js';

async function startServer(): Promise<void> {
  try {
    const env = loadEnv();
    const app = buildApp(env);

    const address = await app.listen({
      port: env.PORT,
      host: env.HOST
    });

    // Start background processing worker
    app.services.worker.startWorker();

    logger.info(`🚀 ClipForge Backend Server running at: ${address}`);
    logger.info(`API Base Endpoint: ${address}${env.API_PREFIX}`);

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down server gracefully...`);
      try {
        await app.services.worker.shutdown();
        await app.close();
        logger.info('ClipForge Backend Server closed cleanly.');
        process.exit(0);
      } catch (err) {
        logger.error({ err }, 'Error during graceful shutdown');
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error({ err }, 'Failed to start ClipForge backend server');
    process.exit(1);
  }
}

startServer();
