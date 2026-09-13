process.env.NODE_ENV = 'test';
process.env.DB_PATH = '/tmp/avsafety-jest/db.json';
delete process.env.GEMINI_API_KEY;
delete process.env.PAYSTACK_SECRET_KEY;
