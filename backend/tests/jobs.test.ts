import request from 'supertest';
import { startServer } from '../../server';

describe('CampusLink Placement Portal - Jobs and Listings API Tests', () => {
  let appInstance: any;
  let serverInstance: any;

  beforeAll(async () => {
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

  it('unrestricted fetch of active job openings list', async () => {
    const res = await request(appInstance).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('jobs');
    expect(Array.isArray(res.body.jobs)).toBe(true);
    expect(res.body.jobs.length).toBeGreaterThan(0);
  });

  it('fetch a single active job spec record by id', async () => {
    const res = await request(appInstance).get('/api/jobs/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('job');
    expect(res.body.job.id).toBe(1);
    expect(res.body.job).toHaveProperty('title');
  });

  it('reject access attempts to create job postings without bearer token', async () => {
    const res = await request(appInstance)
      .post('/api/jobs')
      .send({
        title: 'New Position',
        description: 'No Token Allowed',
        location: 'Virtual',
        salary: '10 LPA',
        deadline: '2026-06-30'
      });

    expect(res.status).toBe(401);
  });

  it('reject candidate students from posting recruitment drives', async () => {
    // 1. Authenticate user as a Student
    const loginRes = await request(appInstance)
      .post('/api/auth/login')
      .send({
        email: 'student.demo@campuslink.edu',
        password: 'student123'
      });

    const token = loginRes.body.token;

    // 2. Try placing job post
    const res = await request(appInstance)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Unauthorized SDE Profile',
        description: 'Should Fail',
        location: 'Bangalore',
        salary: '19 LPA',
        deadline: '2026-06-30'
      });

    expect(res.status).toBe(403);
  });
});
