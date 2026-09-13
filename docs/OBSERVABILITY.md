# Observability Guide

## Logging
Structured JSON logging is provided by `src/utils/logger.ts` with:
- timestamp
- level
- message
- module context
- optional metadata

Sensitive fields are redacted before log emission.

## Error Tracking
Sentry integration (`src/utils/sentry.ts`) supports:
- exception capture
- message capture
- release/environment tagging
- optional tracing sample rate

## Metrics
`src/utils/metrics.ts` tracks:
- endpoint count/error/latency
- external service timing
- dependency check snapshots
- active connection count

## Middleware
`src/middleware/performance.ts` adds automatic request timing and log capture for every API request.

## Recommended Dashboards
- `/api/health` JSON as status source
- Sentry Issues + Performance pages
- Workflow status in GitHub Actions
