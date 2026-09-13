import request from 'supertest';
import { app } from '../../server';

describe('AI agent fallbacks and guards', () => {
  it('returns grounded marketplace recommendations without Gemini', async () => {
    const response = await request(app).post('/api/marketplace/ai-assistant').send({
      organisation: 'Flight Tech',
      message: 'We want an exhibit booth and online logo placement',
      visibilityTypes: ['ONLINE', 'EXHIBITION'],
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.aiGenerated).toBe(false);
    expect(response.body.recommendedPackages.length).toBeGreaterThan(0);
  });

  it('stores a creative request with a fallback AI concept', async () => {
    const response = await request(app).post('/api/marketplace/creative-request').send({
      companyName: 'SkySafe',
      contactPerson: 'A. Manager',
      email: 'creative@example.com',
      message: 'Promote safety leadership',
      targetAudience: 'Airline executives',
      preferredSizeFormat: '1080x1080',
    });

    expect(response.status).toBe(200);
    expect(response.body.request.status).toBe('CONCEPT_DRAFTED');
    expect(response.body.request.aiDraftConcept).toContain('PROPOSED AD CONCEPT FOR SKYSAFE');
  });

  it('rejects general Gemini chat when no API key is configured', async () => {
    const response = await request(app).post('/api/gemini/chat').send({ message: 'Hello' });

    expect(response.status).toBe(500);
    expect(response.body.error).toMatch(/Gemini API not configured/i);
  });

  it('validates required speaker topic suggestion fields', async () => {
    const response = await request(app).post('/api/speakers/ai-suggest-topics').send({ name: 'Jane Doe' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Name and organisation are required/i);
  });

  it('returns deterministic speaker topic suggestions without Gemini', async () => {
    const response = await request(app).post('/api/speakers/ai-suggest-topics').send({
      name: 'Jane Doe',
      organisation: 'Aero Bank',
      industry: 'Banking',
    });

    expect(response.status).toBe(200);
    expect(response.body.topics).toHaveLength(3);
    expect(response.body.topics[0]).toContain('Aero Bank');
    expect(response.body.disclaimer).toContain('NOT OFFICIAL');
  });

  it('answers speaker directory questions from the local fallback search', async () => {
    const response = await request(app).post('/api/speakers/ai-assistant').send({
      question: 'Tell me about FAAN speakers',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.answer).toMatch(/verified summit directory|official summit database/i);
  });

  it('returns curated stakeholder brainstorm candidates with verification markers', async () => {
    const response = await request(app).post('/api/stakeholders/ai-brainstorm').send({});

    expect(response.status).toBe(200);
    expect(response.body.suggestions).toHaveLength(5);
    expect(response.body.suggestions.every((item: any) => item.verificationStatus === 'AI-GENERATED CANDIDATE — NOT YET VERIFIED')).toBe(true);
  });

  it('builds invitation letter drafts without Gemini', async () => {
    const response = await request(app).post('/api/stakeholders/ai-letter').send({
      recipientName: 'Captain Ada',
      recipientOrg: 'NCAA',
      recipientEmail: 'captain.ada@example.com',
      category: 'AVIATION',
    });

    expect(response.status).toBe(200);
    expect(response.body.letter.subject).toContain('Aviation Safety Summit 2026');
    expect(response.body.letter.gmailDraftUrl).toContain('mail.google.com');
    expect(response.body.letter.mailtoUrl).toContain('mailto:');
  });

  it('returns fallback sponsorship proposals without Gemini', async () => {
    const response = await request(app).post('/api/stakeholders/ai-sponsorship-proposal').send({
      companyName: 'Access Holdings',
      industry: 'Banking',
    });

    expect(response.status).toBe(200);
    expect(response.body.proposal.headline).toContain('Access Holdings');
    expect(response.body.proposal.recommendedTiers.length).toBeGreaterThan(0);
  });
});
