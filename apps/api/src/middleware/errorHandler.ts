import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Unhandled API exception occurred', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    stack: config.env !== 'production' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: message,
    ...(config.env !== 'production' ? { stack: err.stack } : {}),
  });
}
