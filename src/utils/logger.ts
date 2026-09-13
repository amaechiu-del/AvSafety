import fs from 'fs';
import path from 'path';
import winston from 'winston';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const REDACTION_KEYS = [
  'authorization',
  'apiKey',
  'api_key',
  'password',
  'token',
  'secret',
  'cardNumber',
  'cvv',
  'email',
  'phone'
];

function redactValue(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    return value
      .replace(/(sk_(test|live)_[A-Za-z0-9]+)/gi, '***REDACTED_PAYSTACK_SECRET***')
      .replace(/(pk_(test|live)_[A-Za-z0-9]+)/gi, '***REDACTED_PAYSTACK_PUBLIC***')
      .replace(/(AIza[0-9A-Za-z_\-]{20,})/g, '***REDACTED_GEMINI_KEY***');
  }
  if (Array.isArray(value)) return value.map(redactValue);
  if (typeof value === 'object') {
    const source = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(source).map(([key, inner]) => {
        if (REDACTION_KEYS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
          return [key, '***REDACTED***'];
        }
        return [key, redactValue(inner)];
      })
    );
  }
  return value;
}

function buildTransports() {
  const transports: winston.transport[] = [new winston.transports.Console()];
  const logDir = path.join(process.cwd(), 'logs');
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    transports.push(
      new winston.transports.File({ filename: path.join(logDir, 'app.log'), level: 'info' }),
      new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
    );
  } catch {
    // no-op: console transport remains available
  }
  return transports;
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      const payload = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...(stack ? { stack } : {}),
        ...(Object.keys(meta).length ? { context: redactValue(meta) } : {})
      };
      return JSON.stringify(payload);
    })
  ),
  transports: buildTransports(),
});

export function logWithContext(level: LogLevel, module: string, message: string, data?: Record<string, unknown>) {
  logger.log(level, message, {
    module,
    ...(data ? { data: redactValue(data) } : {}),
  });
}

export function sanitizeLogData<T>(data: T): T {
  return redactValue(data) as T;
}
