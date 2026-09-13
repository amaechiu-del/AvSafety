# Monitoring Guide

## Overview
AvSafety monitoring combines health checks, structured logs, and workflow-based uptime checks.

## Signals Collected
- API request rate
- Endpoint latency (avg/max)
- Error rate
- Active connections
- Process memory and CPU snapshot
- External dependency checks (Gemini, Paystack, DB)

## Health Endpoint
`GET /api/health`

Example response includes:
- `status`
- `uptimeSeconds`
- `uptimePercentage`
- `activeConnections`
- `errorRate`
- `resources`
- `endpoints`
- `externalServices`
- `dependencies`

## Alerting Baseline
- Critical: health endpoint unavailable for 5 minutes
- Warning: p95 equivalent avg latency > 3000ms on key endpoints
- Warning: error rate > 0.5%
- Info: deployment and daily reports

## Operational Notes
- Configure `HEALTHCHECK_URL` GitHub Actions secret for uptime checks.
- Configure Sentry env variables in runtime for production alerting.
