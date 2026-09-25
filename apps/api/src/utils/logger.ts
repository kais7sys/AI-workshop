import { config } from '../config/index.js';

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Mask sensitive values from log metadata
function sanitizeMetadata(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeMetadata);

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('apikey') ||
      lowerKey.includes('authorization') ||
      lowerKey.includes('key')
    ) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

class Logger {
  private currentLevelIndex: number;

  constructor() {
    const configuredLevel = (config.logging.level as LogLevel) || 'info';
    this.currentLevelIndex = logLevels[configuredLevel] ?? logLevels.info;
  }

  private shouldLog(level: LogLevel): boolean {
    return logLevels[level] <= this.currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const cleanMeta = meta ? sanitizeMetadata(meta) : undefined;

    if (config.env === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...(cleanMeta ? { meta: cleanMeta } : {}),
      });
    }

    const metaStr = cleanMeta ? ` ${JSON.stringify(cleanMeta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  public info(message: string, meta?: any) {
    if (this.shouldLog('info')) console.log(this.formatMessage('info', message, meta));
  }

  public warn(message: string, meta?: any) {
    if (this.shouldLog('warn')) console.warn(this.formatMessage('warn', message, meta));
  }

  public error(message: string, meta?: any) {
    if (this.shouldLog('error')) console.error(this.formatMessage('error', message, meta));
  }

  public debug(message: string, meta?: any) {
    if (this.shouldLog('debug')) console.debug(this.formatMessage('debug', message, meta));
  }

  public http(message: string, meta?: any) {
    if (this.shouldLog('http')) console.log(this.formatMessage('http', message, meta));
  }
}

export const logger = new Logger();
