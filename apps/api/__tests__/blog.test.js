const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

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

async function getAuthToken() {
  const u = makeUser();
  const res = await request(app).post('/auth/register').send(u).expect(201);
  return res.body.data.token;
}

describe('Blog endpoints', () => {
  let token;
  let createdId;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test('create blog (protected) -> 201 and returns blog', async () => {
    const payload = {
      title: 'My Test Blog',
      content: 'Content of the blog',
    };

    const res = await request(app)
      .post('/blog/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      title: payload.title,
      content: payload.content,
    });
    expect(res.body.data.author).toBeTruthy();

    createdId = res.body.data.id;
  });

  test('get blogs -> includes created blog', async () => {
    const res = await request(app).get('/blog/blogs').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find((b) => b.id === createdId);
    expect(found).toBeDefined();
    expect(found.title).toBe('My Test Blog');
  });

  test('update blog (protected) -> 200 and updates fields', async () => {
    const update = { title: 'Updated Title' };
    const res = await request(app)
      .put(`/blog/blogs/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(update.title);
  });

  test('delete blog (protected) -> 200 and blog no longer returned', async () => {
    await request(app)
      .delete(`/blog/blogs/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const res = await request(app).get('/blog/blogs').expect(200);
    const found = res.body.data.find((b) => b.id === createdId);
    expect(found).toBeUndefined();
  });

  test('protected endpoints reject missing or invalid token', async () => {
    const payload = { title: 'X', content: 'Y', author: 'Z' };

    await request(app).post('/blog/blogs').send(payload).expect(401);

    await request(app)
      .post('/blog/blogs')
      .set('Authorization', 'Bearer invalid.token.here')
      .send(payload)
      .expect(401);
  });

  test('creating blog with missing required fields returns error', async () => {
    const res = await request(app)
      .post('/blog/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'c', author: 'a' })
      .expect(500);

    expect(res.body.success).toBe(false);
  });
});
