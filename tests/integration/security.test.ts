import request from 'supertest';
import { app } from '../../server';

describe('security and privacy controls', () => {
  it('does not expose personal registration records publicly', async () => {
    await request(app).post('/api/registrations').send({
      fullName: 'Private Person',
      email: 'private@example.com',
      consentNDPA: true,
    });

    const response = await request(app).get('/api/db');

    expect(response.body.registrations).toEqual([]);
    expect(response.body.registrationCount).toBe(1);
  });

  it('prevents duplicate stakeholder entries', async () => {
    await request(app).post('/api/stakeholders').send({
      name: 'Duplicate Candidate',
      organisation: 'Airspace Inc',
      category: 'AVIATION',
    });

    const response = await request(app).post('/api/stakeholders').send({
      name: 'Duplicate Candidate',
      organisation: 'Airspace Inc',
      category: 'AVIATION',
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/already exists/i);
  });

  it('adds a verification note when a stakeholder is confirmed', async () => {
    const createResponse = await request(app).post('/api/stakeholders').send({
      name: 'Confirmed Guest',
      organisation: 'Safety House',
      category: 'AVIATION',
    });

    const updateResponse = await request(app)
      .put(`/api/stakeholders/${createResponse.body.stakeholder.id}`)
      .send({ status: 'CONFIRMED' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.stakeholder.responseNotes).toMatch(/Confirmed via official correspondence/i);
  });

  it('returns 404 for unknown artwork uploads', async () => {
    const response = await request(app).post('/api/marketplace/orders/artwork').send({
      orderId: 'missing-order',
      fileName: 'creative.png',
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Order not found/i);
  });
});
