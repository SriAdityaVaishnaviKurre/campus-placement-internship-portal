const request = require('supertest');
const { startServer } = require('../../server');

describe('Authentication API Endpoint Unit Tests', () => {
  let app;
  let server;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const result = await startServer();
    app = result.app;
    server = result.server;
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  const uniqueEmail = `recruiter.new.${Date.now()}@corporate.com`;

  describe('POST /api/auth/register', () => {
    it('successfully registers a user with student credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sarah Connor',
          email: `sarah.c.${Date.now()}@resistance.org`,
          password: 'cyberdyne123',
          role: 'student'
        });

      expect(res.status).toBe(211); // Custom status code preserved
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.role).toBe('student');
    });

    it('successfully registers a user with recruiter credentials', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Miles Dyson',
          email: uniqueEmail,
          password: 'cyberdyne123',
          role: 'recruiter'
        });

      expect(res.status).toBe(211);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.role).toBe('recruiter');
    });

    it('rejects registration of a duplicate email address', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Miles',
          email: uniqueEmail,
          password: 'anotherpassword',
          role: 'recruiter'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('authenticates a registered user and delivers a JWT bearer token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'cyberdyne123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    it('rejects logins with invalid passwords', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
