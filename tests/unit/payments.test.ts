import request from 'supertest';
import { app, readDb } from '../../server';

describe('payment processing', () => {
  it('rejects initialization requests without the required payload', async () => {
    const response = await request(app).post('/api/paystack/initialize').send({ amount: 5000 });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Email and amount are required/i);
  });

  it('initializes sandbox checkout when no live Paystack key is configured', async () => {
    const response = await request(app).post('/api/paystack/initialize').send({
      email: 'finance@example.com',
      amount: 250000,
      currency: 'NGN',
      companyName: 'Domislink',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.isSandbox).toBe(true);
    expect(response.body.authorization_url).toContain('/paystack-checkout?ref=');
  });

  it('requires a payment reference for verification', async () => {
    const response = await request(app).post('/api/paystack/verify').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/reference is mandatory/i);
  });

  it('verifies sandbox references and updates the matching order status', async () => {
    const orderResponse = await request(app).post('/api/marketplace/orders').send({
      companyName: 'Aero Logistics',
      email: 'ops@example.com',
      items: [],
      totalAmount: 125000,
      orderStatus: 'SUBMITTED',
    });

    const verifyResponse = await request(app).post('/api/paystack/verify').send({
      reference: 'pstk_ref_test_12345',
      orderId: orderResponse.body.order.id,
      amount: 125000,
    });

    const savedOrder = readDb().commercial_orders[0];

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.verified).toBe(true);
    expect(verifyResponse.body.order.paymentStatus).toBe('VERIFIED_PAID');
    expect(savedOrder.paymentStatus).toBe('VERIFIED_PAID');
    expect(savedOrder.orderStatus).toBe('APPROVED');
  });

  it('rejects unverified payment references', async () => {
    const response = await request(app).post('/api/paystack/verify').send({
      reference: 'invalid-reference',
    });

    expect(response.status).toBe(402);
    expect(response.body.error).toMatch(/unconfirmed/i);
  });
});
