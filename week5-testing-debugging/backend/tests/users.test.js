const request = require('supertest');
const { startServer } = require('../../server');

describe('Users & Profiles API Endpoint Unit Tests', () => {
  let app;
  let server;
  let studentToken;
  let recruiterToken;
  let adminToken;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const result = await startServer();
    app = result.app;
    server = result.server;

    // Login default users from seeds to retrieve active authorization JWT tokens
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

  describe('GET /api/users/profile/student', () => {
    it('returns the active student profile for authorized student role session', async () => {
      const res = await request(app)
        .get('/api/users/profile/student')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('student');
      expect(parseFloat(res.body.student.cgpa)).toBe(8.42);
    });

    it('rejects profile retrieval attempts if authorization token is absent', async () => {
      const res = await request(app).get('/api/users/profile/student');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile/student', () => {
    it('updates academic cgpa and skills registry under student clearance', async () => {
      const res = await request(app)
        .put('/api/users/profile/student')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          cgpa: 9.10,
          skills: 'ReactJS, TailwindCSS, Jest Testing',
          resumeUrl: 'https://campuslink.edu/resumes/amit_sharma_revised.pdf'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('updated successfully');

      // Re-verify updating state
      const checkRes = await request(app)
        .get('/api/users/profile/student')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(parseFloat(checkRes.body.student.cgpa)).toBe(9.10);
      expect(checkRes.body.student.skills).toContain('TailwindCSS');
    });
  });

  describe('GET /api/users/profile/recruiter', () => {
    it('returns recruiter details for recruiter role session', async () => {
      const res = await request(app)
        .get('/api/users/profile/recruiter')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('recruiter');
      expect(res.body.recruiter.company_name).toBe('Microsoft India');
    });
  });

  describe('PUT /api/users/profile/recruiter', () => {
    it('saves changed corporate organization metadata', async () => {
      const res = await request(app)
        .put('/api/users/profile/recruiter')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          companyName: 'Microsoft Dev Center India',
          companyEmail: 'devcareers@microsoft.com'
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('saved successfully');
    });
  });

  describe('GET /api/users/admin/users', () => {
    it('allows site administrators to list full account directory rosters', async () => {
      const res = await request(app)
        .get('/api/users/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('blocks general student roles from administrative account listings', async () => {
      const res = await request(app)
        .get('/api/users/admin/users')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });
  });
});
