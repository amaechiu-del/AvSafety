import { defaultDb, writeDb } from '../server';

function cloneDefaultDb() {
  return JSON.parse(JSON.stringify(defaultDb));
}

beforeEach(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.PAYSTACK_SECRET_KEY;
  writeDb(cloneDefaultDb());
});
