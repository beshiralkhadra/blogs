const request = require('supertest');

// Ensure test env before importing app
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const { createApp, sequelize } = require('../app');

const app = createApp();

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

function makeUser(overrides = {}) {
  const n = Math.floor(Math.random() * 1e9);
  return {
    name: overrides.name || `Test User ${n}`,
    email: overrides.email || `user${n}@example.com`,
    password: overrides.password || 'password123',
  };
}

describe('Auth flow', () => {
  test('register returns 201 with user and token; login returns token; /me validates JWT', async () => {
    const u = makeUser();

    // Register
    const reg = await request(app)
      .post('/auth/register')
      .send(u)
      .expect(201);

    expect(reg.body.success).toBe(true);
    expect(reg.body.data.user).toMatchObject({ name: u.name, email: u.email.toLowerCase() });
    expect(typeof reg.body.data.token).toBe('string');

    const token = reg.body.data.token;

    // Access /me with the token
    const me = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.success).toBe(true);
    expect(me.body.data.user).toMatchObject({ name: u.name, email: u.email.toLowerCase() });

    // Login with same credentials
    const login = await request(app)
      .post('/auth/login')
      .send({ email: u.email, password: u.password })
      .expect(200);

    expect(login.body.success).toBe(true);
    expect(typeof login.body.data.token).toBe('string');
  });

  test('duplicate registration yields 409', async () => {
    const u = makeUser({ email: 'dup@example.com' });
    await request(app).post('/auth/register').send(u).expect(201);
    const dup = await request(app).post('/auth/register').send(u).expect(409);
    expect(dup.body.success).toBe(false);
    expect(dup.body.message).toMatch(/already/i);
  });

  test('login with invalid credentials yields 401', async () => {
    const u = makeUser();
    await request(app).post('/auth/register').send(u).expect(201);

    await request(app)
      .post('/auth/login')
      .send({ email: u.email, password: 'wrongpass' })
      .expect(401);

    await request(app)
      .post('/auth/login')
      .send({ email: 'nouser@example.com', password: 'password123' })
      .expect(401);
  });

  test('protected route rejects missing or invalid token', async () => {
    await request(app).get('/auth/me').expect(401);
    await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.here')
      .expect(401);
  });

  test('validation errors return 422 for bad payloads', async () => {
    const bad1 = await request(app)
      .post('/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: '123' })
      .expect(422);
    expect(bad1.body.success).toBe(false);
    expect(Array.isArray(bad1.body.errors)).toBe(true);

    const bad2 = await request(app)
      .post('/auth/login')
      .send({ email: 'not-an-email' })
      .expect(422);
    expect(bad2.body.success).toBe(false);
  });
});
