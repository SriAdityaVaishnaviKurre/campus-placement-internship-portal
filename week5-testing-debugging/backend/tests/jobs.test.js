const request = require('supertest');
const { startServer } = require('../../server');

describe('Jobs & Vacancy listings API Endpoint Unit Tests', () => {
  let app;
  let server;
  let studentToken;
  let recruiterToken;
  let createdJobId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const result = await startServer();
    app = result.app;
    server = result.server;

    // Login users to acquire tokens
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student.demo@campuslink.edu', password: 'student123' });
    studentToken = studentLogin.body.token;

    const recruiterLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'recruiter.demo@campuslink.edu', password: 'recruiter123' });
    recruiterToken = recruiterLogin.body.token;
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET /api/jobs', () => {
    it('unrestrictedly fetches all active job post opportunities without tokens', async () => {
      const res = await request(app).get('/api/jobs');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('jobs');
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('successfully retrieves a registered placement specification by ID', async () => {
      const res = await request(app).get('/api/jobs/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('job');
      expect(res.body.job.id).toBe(1);
    });

    it('returns 404 for non-existent job specification IDs', async () => {
      const res = await request(app).get('/api/jobs/9999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/jobs', () => {
    it('restricts unauthenticated attempts from creating opportunities', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({ title: 'Rogue Job', salary: '50 LPA' });
      expect(res.status).toBe(401);
    });

    it('restricts general student clearance profiles from hosting career drives', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Rogue Posting SDE',
          description: 'Hacking roles',
          location: 'Delhi',
          salary: '12 LPA',
          deadline: '2026-08-31'
        });
      expect(res.status).toBe(403);
    });

    it('authorizes recruiters to broadcast and host new recruitment plans', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Full Stack Engineer (MERN)',
          description: 'Build enterprise visual layers. Fully test components using Jest.',
          location: 'Hyderabad, India',
          salary: '18.5 LPA',
          deadline: '2026-09-01'
        });

      expect(res.status).toBe(211);
      expect(res.body).toHaveProperty('jobId');
      createdJobId = res.body.jobId;
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('updates job compensation and detail attributes when authorized', async () => {
      const res = await request(app)
        .put(`/api/jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Lead Full Stack Architect (MERN)',
          salary: '25 LPA',
          location: 'Remote Bangalore'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('updated successfully');

      // Re-fetch to verify updates
      const checkRes = await request(app).get(`/api/jobs/${createdJobId}`);
      expect(checkRes.body.job.title).toBe('Lead Full Stack Architect (MERN)');
      expect(checkRes.body.job.salary).toBe('25 LPA');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('removes career entries when recruiter invokes termination', async () => {
      const res = await request(app)
        .delete(`/api/jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deleted successfully');

      // Verify removal
      const checkRes = await request(app).get(`/api/jobs/${createdJobId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
