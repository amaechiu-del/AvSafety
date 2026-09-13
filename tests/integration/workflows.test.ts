import request from 'supertest';
import { app, readDb } from '../../server';

describe('integration workflows', () => {
  it('completes the attendee registration flow and stores NDPA consent', async () => {
    const registrationResponse = await request(app).post('/api/registrations').send({
      fullName: 'Test Delegate',
      email: 'delegate@example.com',
      organisation: 'Flight Ops Ltd',
      consentNDPA: true,
    });

    const adminResponse = await request(app).get('/api/admin/registrations').set('x-admin-mode', 'true');

    expect(registrationResponse.status).toBe(200);
    expect(registrationResponse.body.registration.registrationCode).toMatch(/^AVS26-\d{4}$/);
    expect(adminResponse.body.registrations[0].consentNDPA).toBe(true);
  });

  it('completes a stakeholder invitation workflow from create to dispatch', async () => {
    const stakeholderResponse = await request(app).post('/api/stakeholders').send({
      name: 'Captain Safety',
      organisation: 'Sky Authority',
      category: 'AVIATION',
      email: 'captain@example.com',
    });

    const dispatchResponse = await request(app).post('/api/stakeholders/dispatch-letter').send({
      inviteeId: stakeholderResponse.body.stakeholder.id,
      recipientEmail: 'captain@example.com',
      subject: 'Invitation',
      method: 'DOMISLINK_MAIL_AI_GMAIL',
    });

    expect(dispatchResponse.status).toBe(200);
    expect(dispatchResponse.body.invitee.status).toBe('INVITATION SENT');
    expect(dispatchResponse.body.followUpDate).toBeTruthy();
  });

  it('completes a commercial order to payment verification workflow', async () => {
    const orderResponse = await request(app).post('/api/marketplace/orders').send({
      companyName: 'Aviation Insure',
      email: 'sponsor@example.com',
      items: [],
      totalAmount: 500000,
    });

    const paymentResponse = await request(app).post('/api/paystack/initialize').send({
      email: 'sponsor@example.com',
      amount: 500000,
      orderId: orderResponse.body.order.id,
    });

    const verifyResponse = await request(app).post('/api/paystack/verify').send({
      reference: paymentResponse.body.reference,
      orderId: orderResponse.body.order.id,
      amount: 500000,
    });

    expect(paymentResponse.body.success).toBe(true);
    expect(verifyResponse.body.order.paymentStatus).toBe('VERIFIED_PAID');
  });

  it('supports an AI-assisted sponsorship proposal workflow without external AI', async () => {
    const brainstormResponse = await request(app).post('/api/stakeholders/ai-brainstorm').send({});
    const proposalResponse = await request(app).post('/api/stakeholders/ai-sponsorship-proposal').send({
      companyName: brainstormResponse.body.suggestions[0].organisation,
      industry: brainstormResponse.body.suggestions[0].category,
    });

    expect(brainstormResponse.body.suggestions.length).toBeGreaterThan(0);
    expect(proposalResponse.body.proposal.recommendedTiers.length).toBeGreaterThan(0);
  });

  it('stores memo submissions end to end', async () => {
    const response = await request(app).post('/api/memos').send({
      title: 'Safety Memo',
      author: 'Quality Team',
      content: 'Improve ground handling checklists.',
    });

    expect(response.status).toBe(200);
    expect(response.body.memo.id).toMatch(/^memo-/);
    expect(readDb().memo_submissions[0].title).toBe('Safety Memo');
  });
});
