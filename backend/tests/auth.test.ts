import request from 'supertest';
import { startServer } from '../../server';

describe('CampusLink Placement Portal - Authentication API Tests', () => {
  let appInstance: any;
  let serverInstance: any;

  beforeAll(async () => {
    // Fire up a testing server instance in testing environment config
    process.env.NODE_ENV = 'test';
    const { app, server } = await startServer();
    appInstance = app;
    serverInstance = server;
  });

  afterAll((done) => {
    if (serverInstance) {
      serverInstance.close(done);
    } else {
      done();
    }
  });

  const testEmail = `testUser${Date.now()}@campuslink.edu`;

  it('should successfully register a new student account', async () => {
    const res = await request(appInstance)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: testEmail,
        password: 'password123',
        role: 'student'
      });

    expect(res.status).toBe(211);
    expect(res.body).toHaveProperty('message');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testEmail);
  });

  it('not permit duplicate registration on the same email', async () => {
    const res = await request(appInstance)
      .post('/api/auth/register')
      .send({
        name: 'Jane Duplicate',
        email: testEmail,
        password: 'password123',
        role: 'student'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('successfully sign in the registered student', async () => {
    const res = await request(appInstance)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('student');
  });

  it('reject sign in requests with invalid credentials', async () => {
    const res = await request(appInstance)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('terminate session securely upon logout command', async () => {
    const res = await request(appInstance)
      .post('/api/auth/logout')
      .send();

    expect(res.status).toBe(200);
  });
});
