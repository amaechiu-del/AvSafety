import type { Request, Response, NextFunction } from 'express';
import { decrementConnections, incrementConnections, nowMs, recordApiMetric } from '../utils/metrics';
import { logWithContext } from '../utils/logger';

export function performanceMonitoringMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = nowMs();
  incrementConnections();

  res.on('finish', () => {
    const durationMs = nowMs() - start;
    recordApiMetric(`${req.method} ${req.route?.path || req.path}`, durationMs, res.statusCode);
    decrementConnections();

    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logWithContext(level, 'http', 'Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      userAgent: req.headers['user-agent'],
      requestId: req.headers['x-request-id'],
    });
  });

  next();
}
