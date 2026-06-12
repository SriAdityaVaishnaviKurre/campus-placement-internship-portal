const request = require('supertest');
const { startServer } = require('../../server');

describe('Job Applications API Endpoint Unit Tests', () => {
  let app;
  let server;
  let studentToken;
  let recruiterToken;
  let adminToken;
  let testAppId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const result = await startServer();
    app = result.app;
    server = result.server;

    // Login default users from seeds 
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student.demo@campuslink.edu', password: 'student123' });
    studentToken = studentLogin.body.token;

    const recruiterLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'recruiter.demo@campuslink.edu', password: 'recruiter123' });
    recruiterToken = recruiterLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@campuslink.edu', password: 'admin123' });
    adminToken = adminLogin.body.token;
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('POST /api/applications', () => {
    it('allows students to submit profile applications corresponding to active jobs', async () => {
      // Apply for Job ID 2
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ jobId: 2 });

      expect(res.status).toBe(211); // Custom status code preserved
      expect(res.body).toHaveProperty('applicationId');
      testAppId = res.body.applicationId;
    });

    it('blocks recruiters from submitting candidates for jobs themselves', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ jobId: 2 });

      expect(res.status).toBe(403);
    });

    it('rejects duplicate applications on individual placements by the same student', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ jobId: 2 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/applications', () => {
    it('returns submitted applications list under relevant credentials', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('applications');
      expect(Array.isArray(res.body.applications)).toBe(true);
    });
  });

  describe('PUT /api/applications/:id', () => {
    it('allows recruiters to transition submission status (e.g., shortlisted)', async () => {
      const res = await request(app)
        .put(`/api/applications/${testAppId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ status: 'shortlisted' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('updated successfully');
    });

    it('restricts students from editing their own submission status reviews', async () => {
      const res = await request(app)
        .put(`/api/applications/${testAppId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status: 'shortlisted' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/applications/admin/reports', () => {
    it('authorizes site administrators to pull analytics reports', async () => {
      const res = await request(app)
        .get('/api/applications/admin/reports')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('applicationsCount');
      expect(res.body).toHaveProperty('usersCount');
    });

    it('blocks recruiter roles from accessing analytical panels', async () => {
      const res = await request(app)
        .get('/api/applications/admin/reports')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
    });
  });
});
