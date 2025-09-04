process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_ISS = 'blogs-api';
process.env.JWT_AUD = 'blogs-client';
process.env.JWT_EXPIRES_IN = '1h';

const fs = require('fs');
const path = require('path');

// Ensure the test database file is reset before the test suite runs
const dbPath = path.resolve(__dirname, 'database.test.sqlite');
try {
  if (fs.existsSync(dbPath)) {
    fs.rmSync(dbPath);
  }
} catch (e) {
  // ignore
}
