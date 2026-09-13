import fs from 'fs';
import { defaultDb, getDbPath, readDb, writeDb } from '../../server';

function cloneDefaultDb() {
  return JSON.parse(JSON.stringify(defaultDb));
}

describe('data utilities', () => {
  it('persists database updates to the configured file path', () => {
    const updated = cloneDefaultDb();
    updated.event.name = 'AvSafety Test Event';

    writeDb(updated);

    const saved = readDb();
    expect(saved.event.name).toBe('AvSafety Test Event');
    expect(fs.existsSync(getDbPath())).toBe(true);
  });

  it('recovers to defaults when the database file is unreadable JSON', () => {
    fs.writeFileSync(getDbPath(), '{not-valid-json', 'utf8');

    const recovered = readDb();
    const rewritten = JSON.parse(fs.readFileSync(getDbPath(), 'utf8'));

    expect(recovered.event.name).toBe(defaultDb.event.name);
    expect(rewritten.event.name).toBe(defaultDb.event.name);
  });

  it('auto-migrates missing speaker and stakeholder seed data', () => {
    const stale = cloneDefaultDb();
    stale.speakers = [];
    stale.stakeholders = [];

    writeDb(stale);

    const migrated = readDb();
    expect(migrated.speakers.length).toBeGreaterThanOrEqual(10);
    expect(migrated.stakeholders.length).toBeGreaterThanOrEqual(5);
  });
});
