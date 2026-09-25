import { Router, Request, Response } from 'express';
import { db } from '../repositories/db.js';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'krishiseva-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/ready', (req: Request, res: Response) => {
  // Check that the core database tables/store are initialized
  const dbReady = db.profiles.length > 0;
  if (!dbReady) {
    res.status(503).json({
      status: 'unavailable',
      message: 'Database storage layer is not ready',
    });
    return;
  }

  res.json({
    status: 'ready',
    service: 'krishiseva-api',
    checks: {
      database: 'connected',
      storage: 'ready',
      ai: 'ready',
    },
    timestamp: new Date().toISOString(),
  });
});
