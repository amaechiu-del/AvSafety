export const performanceConfig = {
  cacheTtlSeconds: {
    api: 300,
    aiResponses: 600,
    staticAssets: 3600,
  },
  timeoutsMs: {
    api: 10000,
    ai: 30000,
    payment: 15000,
    database: 5000,
  },
  rateLimit: {
    requestsPerMinute: 120,
    requestsPerHour: 1500,
  },
  database: {
    poolSize: {
      min: 10,
      max: 20,
    },
    queryTargetP95Ms: 100,
  },
  apiTargetsMs: {
    speakers: 200,
    stakeholders: 300,
    marketplace: 250,
    payments: 1000,
    ai: 3000,
    analytics: 500,
  },
} as const;

export type PerformanceConfig = typeof performanceConfig;
