import * as Sentry from '@sentry/node';

let sentryReady = false;

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || sentryReady) return;

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    debug: process.env.SENTRY_DEBUG === 'true',
    sendDefaultPii: false,
  });

  sentryReady = true;
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (!sentryReady) return;
  Sentry.withScope((scope) => {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value as never);
      }
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (!sentryReady) return;
  Sentry.captureMessage(message, level);
}

export function sentryErrorHandler(err: unknown, _req: unknown, _res: unknown, next: () => void) {
  captureException(err);
  next();
}
