# Testing Guide

## Local commands

- `npm test` - run the full Jest suite in band
- `npm run test:unit` - unit coverage for AI fallbacks, payments, and data helpers
- `npm run test:api` - API contract and privacy tests
- `npm run test:integration` - workflow, persistence, and security-oriented integration tests
- `npm run test:coverage` - generate a coverage report in `coverage/`
- `npm run test:security` - run security/privacy integration tests plus `npm audit`

## Test structure

```text
tests/
├── api/
│   └── endpoints.test.ts
├── integration/
│   ├── database.test.ts
│   ├── security.test.ts
│   └── workflows.test.ts
├── performance/
│   └── load.test.js
└── unit/
    ├── ai-agents.test.ts
    ├── data.test.ts
    └── payments.test.ts
```

## Scope covered today

- AI fallback behavior and anti-fabrication markers
- Paystack sandbox initialization and verification
- Public/admin API privacy boundaries
- Registration, stakeholder, memo, and order workflows
- JSON database recovery and atomic persistence

## Writing new tests

1. Keep tests isolated by using the shared temporary DB configured in `tests/setup-env.ts`.
2. Prefer exercising endpoints through Supertest instead of mocking internal Express behavior.
3. Add regression coverage for any change that affects privacy, payment status, or persisted records.
4. Use integration tests for multi-step workflows and unit tests for narrow fallback/error paths.
