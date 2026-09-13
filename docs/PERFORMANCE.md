# Performance Guide

## Targets
- Speakers endpoints: <200ms
- Stakeholder endpoints: <300ms
- Marketplace endpoints: <250ms
- Payment endpoints: <1000ms
- AI endpoints: <3000ms
- Analytics endpoints: <500ms

## Configuration
Performance defaults are in `config/performance.config.ts`:
- Cache TTL values
- Timeout values
- Rate limit thresholds
- DB pool target range

## Current Optimizations
- Vite chunk splitting for vendor and data modules
- PWA/static asset caching via Workbox runtime caching
- API-level request timing middleware
- External service timing hooks for Gemini and Paystack endpoints

## Regression Detection
GitHub workflow `.github/workflows/performance.yml`:
- Runs on push/PR to main
- Builds the app
- Produces `performance-report.json`
- Fails when bundle budget exceeds threshold
