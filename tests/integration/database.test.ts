import request from 'supertest';
import fs from 'fs';
import { app, defaultDb, getDbPath, readDb } from '../../server';

describe('database persistence and recovery', () => {
  it('persists data across consecutive reads', async () => {
    await request(app).post('/api/memos').send({
      title: 'Persistent Memo',
      content: 'This should persist between reads.',
    });

    const firstRead = readDb();
    const secondRead = readDb();

    expect(firstRead.memo_submissions[0].title).toBe('Persistent Memo');
    expect(secondRead.memo_submissions[0].title).toBe('Persistent Memo');
  });

  it('restores the seeded data set through the reset endpoint', async () => {
    await request(app).post('/api/memos').send({ title: 'Temporary Memo' });
    const response = await request(app).post('/api/db/reset').send({});

    expect(response.status).toBe(200);
    expect(response.body.db.event.name).toBe(defaultDb.event.name);
    expect(readDb().memo_submissions).toEqual(defaultDb.memo_submissions);
  });

  it('recovers from a corrupted database file', async () => {
    fs.writeFileSync(getDbPath(), '}{', 'utf8');

    const response = await request(app).get('/api/db');

    expect(response.status).toBe(200);
    expect(response.body.event.name).toBe(defaultDb.event.name);
  });

  it('handles repeated registration writes without dropping records', async () => {
    for (const index of Array.from({ length: 5 }, (_, value) => value)) {
      await request(app).post('/api/registrations').send({
        fullName: `Delegate ${index}`,
        email: `delegate${index}@example.com`,
        consentNDPA: true,
      });
    }

    const registrations = readDb().registrations;
    const savedEmails = new Set(registrations.map((registration: any) => registration.email));

    expect(registrations).toHaveLength(5);
    expect(savedEmails).toEqual(
      new Set([
        'delegate0@example.com',
        'delegate1@example.com',
        'delegate2@example.com',
        'delegate3@example.com',
        'delegate4@example.com',
      ]),
    );
  });
});
