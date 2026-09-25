import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`====================================================`);
  logger.info(`AI-Powered Agriculture Department Platform API Server`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Listening on: http://localhost:${config.port}`);
  logger.info(`Health check: http://localhost:${config.port}/health`);
  logger.info(`Readiness probe: http://localhost:${config.port}/ready`);
  logger.info(`Frontend URL: ${config.frontendUrl}`);
  logger.info(`AI Model: ${config.gemini.model}`);
  logger.info(`====================================================`);
});

// Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed cleanly');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed cleanly');
    process.exit(0);
  });
});
