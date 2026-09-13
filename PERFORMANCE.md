# Performance Benchmarks

## Automated load checks

The repository includes a k6 smoke-load scenario at `tests/performance/load.test.js` and a GitHub Actions workflow at `.github/workflows/performance.yml`.

## Current thresholds

- `http_req_failed < 1%`
- `p95 http_req_duration < 1500ms`

## Endpoints exercised

- `GET /api/health`
- `GET /api/marketplace/inventory`
- `POST /api/registrations`

## Usage

Local k6 execution example:

```bash
k6 run tests/performance/load.test.js
```

In CI, the workflow builds the app, starts the bundled server, and runs the same script against `http://127.0.0.1:3000`.
