import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:3000';

export default function () {
  const health = http.get(`${baseUrl}/api/health`);
  check(health, {
    'health endpoint is up': (res) => res.status === 200,
  });

  const inventory = http.get(`${baseUrl}/api/marketplace/inventory`);
  check(inventory, {
    'inventory endpoint is up': (res) => res.status === 200,
  });

  const registration = http.post(
    `${baseUrl}/api/registrations`,
    JSON.stringify({
      fullName: `Load Test User ${__VU}-${__ITER}`,
      email: `load-${__VU}-${__ITER}@example.com`,
      organisation: 'Performance Lab',
      consentNDPA: true,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  check(registration, {
    'registration request succeeds': (res) => res.status === 200,
    'registration code returned': (res) => JSON.parse(res.body).registration.registrationCode.length > 0,
  });

  sleep(1);
}
