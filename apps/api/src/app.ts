import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { healthRouter } from './routes/health.js';
import { apiRouter } from './routes/index.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: config.env === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request Body Parsers (with safe size limit)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logging
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
  }

  // Health and Readiness Check Routes (Top-level probes)
  app.use('/', healthRouter);

  // Global Rate Limiting on API endpoints
  app.use('/api', globalRateLimiter);

  // Mount API Domain Routes
  app.use('/api', apiRouter);

  // Serve static client bundle in production if built
  const webDistPath = path.resolve(__dirname, '../../../web/dist');
  app.use(express.static(webDistPath));

  // Catch-all for single-page client routing (excluding API routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/ready')) {
      return next();
    }
    res.sendFile(path.join(webDistPath, 'index.html'), (err) => {
      if (err) next();
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
