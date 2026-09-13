import request from 'supertest';
import { app } from '../../server';

describe('API endpoints', () => {
  it('reports health and service configuration state', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.services.database).toBe('ok');
    expect(response.body.services.gemini).toBe('not_configured');
  });

  it('hides registration PII from the public database response', async () => {
    await request(app).post('/api/registrations').send({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      consentNDPA: true,
    });

    const response = await request(app).get('/api/db');

    expect(response.status).toBe(200);
    expect(response.body.registrations).toEqual([]);
    expect(response.body.registrationCount).toBe(1);
  });

  it('exposes the full database to admins only', async () => {
    await request(app).post('/api/registrations').send({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      consentNDPA: true,
    });

    const response = await request(app).get('/api/db').set('x-admin-mode', 'true');

    expect(response.status).toBe(200);
    expect(response.body.registrations).toHaveLength(1);
    expect(response.body.registrations[0].email).toBe('grace@example.com');
  });

  it('blocks non-admin access to registration admin APIs', async () => {
    const response = await request(app).get('/api/admin/registrations');

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Unauthorized/i);
  });

  it('returns marketplace inventory and sponsorship packages', async () => {
    const response = await request(app).get('/api/marketplace/inventory');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.positions.length).toBeGreaterThan(0);
    expect(response.body.packages.length).toBeGreaterThan(0);
  });

  it('requires admin context to list the full order ledger', async () => {
    await request(app).post('/api/marketplace/orders').send({
      companyName: 'Secure Air',
      email: 'ledger@example.com',
      totalAmount: 1000,
    });

    const response = await request(app).get('/api/marketplace/orders');

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Unauthorized/i);
  });

  it('allows customers to filter order history by email without admin mode', async () => {
    await request(app).post('/api/marketplace/orders').send({
      companyName: 'Secure Air',
      email: 'customer@example.com',
      totalAmount: 1000,
    });

    const response = await request(app).get('/api/marketplace/orders').query({ email: 'customer@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.orders).toHaveLength(1);
    expect(response.body.orders[0].email).toBe('customer@example.com');
  });
});
