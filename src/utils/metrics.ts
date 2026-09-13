import { performance } from 'perf_hooks';

type EndpointMetric = {
  count: number;
  errors: number;
  totalDurationMs: number;
  maxDurationMs: number;
};

type DependencyStatus = {
  status: 'up' | 'down' | 'degraded';
  latencyMs: number;
  message?: string;
  checkedAt: string;
};

const endpointMetrics = new Map<string, EndpointMetric>();
const dependencyChecks = new Map<string, DependencyStatus>();
const externalServiceMetrics = new Map<string, EndpointMetric>();

let activeConnections = 0;

export function incrementConnections() {
  activeConnections += 1;
}

export function decrementConnections() {
  activeConnections = Math.max(0, activeConnections - 1);
}

export function nowMs() {
  return performance.now();
}

export function recordApiMetric(endpoint: string, durationMs: number, statusCode: number) {
  const current = endpointMetrics.get(endpoint) || {
    count: 0,
    errors: 0,
    totalDurationMs: 0,
    maxDurationMs: 0,
  };

  current.count += 1;
  current.totalDurationMs += durationMs;
  current.maxDurationMs = Math.max(current.maxDurationMs, durationMs);
  if (statusCode >= 500) {
    current.errors += 1;
  }

  endpointMetrics.set(endpoint, current);
}

export function recordExternalServiceMetric(service: string, durationMs: number, isError = false) {
  const current = externalServiceMetrics.get(service) || {
    count: 0,
    errors: 0,
    totalDurationMs: 0,
    maxDurationMs: 0,
  };
  current.count += 1;
  current.totalDurationMs += durationMs;
  current.maxDurationMs = Math.max(current.maxDurationMs, durationMs);
  if (isError) current.errors += 1;
  externalServiceMetrics.set(service, current);
}

export function recordDependencyCheck(name: string, status: DependencyStatus['status'], latencyMs: number, message?: string) {
  dependencyChecks.set(name, {
    status,
    latencyMs,
    message,
    checkedAt: new Date().toISOString(),
  });
}

function summarise(metrics: Map<string, EndpointMetric>) {
  return Array.from(metrics.entries()).reduce<Record<string, { count: number; errorRate: number; avgDurationMs: number; maxDurationMs: number }>>((acc, [key, value]) => {
    const errorRate = value.count > 0 ? (value.errors / value.count) * 100 : 0;
    const avgDurationMs = value.count > 0 ? value.totalDurationMs / value.count : 0;
    acc[key] = {
      count: value.count,
      errorRate: Number(errorRate.toFixed(3)),
      avgDurationMs: Number(avgDurationMs.toFixed(2)),
      maxDurationMs: Number(value.maxDurationMs.toFixed(2)),
    };
    return acc;
  }, {});
}

export function getHealthSnapshot(startedAtMs: number) {
  const endpointSummary = summarise(endpointMetrics);
  const serviceSummary = summarise(externalServiceMetrics);
  const totalRequests = Object.values(endpointSummary).reduce((sum, metric) => sum + metric.count, 0);
  const totalErrors = Object.values(endpointSummary).reduce((sum, metric) => sum + Math.round((metric.errorRate / 100) * metric.count), 0);
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  return {
    status: Array.from(dependencyChecks.values()).some((d) => d.status === 'down') ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAtMs) / 1000),
    uptimePercentage: Number((100 - Math.min(errorRate, 100)).toFixed(3)),
    activeConnections,
    errorRate: Number(errorRate.toFixed(3)),
    resources: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
    endpoints: endpointSummary,
    externalServices: serviceSummary,
    dependencies: Object.fromEntries(dependencyChecks.entries()),
  };
}
