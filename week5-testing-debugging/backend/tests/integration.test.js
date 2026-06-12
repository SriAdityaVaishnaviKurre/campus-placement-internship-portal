const request = require('supertest');
const { startServer } = require('../../server');

describe('End-to-End System Integration Flow Tests', () => {
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

  describe('Flow 1: User Onboarding and Validation', () => {
    const freshUserMail = `onboard_candidate_${Date.now()}@campuslink.edu`;
    let userToken;

    it('should complete registration -> login -> profile query flow successfully', async () => {
      // 1. Submit Registration Package
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Rachel Tyrell',
          email: freshUserMail,
          password: 'replicant123',
          role: 'student'
        });
      expect(regRes.status).toBe(211);
      expect(regRes.body.user.email).toBe(freshUserMail);

      // 2. Perform Portal Authentication Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: freshUserMail,
          password: 'replicant123'
        });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
      userToken = loginRes.body.token;

      // 3. Setup student profile initially
      const createProfileRes = await request(app)
        .post('/api/users/profile/student')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cgpa: 9.35,
          skills: 'Deep Learning, Voight-Kampff, Python',
          resumeUrl: 'https://campuslink.edu/resumes/rachel_tyrell_cv.pdf'
        });
      expect(createProfileRes.status).toBe(211);

      // 4. Validate profile is successfully set and retrieved
      const profileGetRes = await request(app)
        .get('/api/users/profile/student')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(profileGetRes.status).toBe(200);
      expect(profileGetRes.body.student.skills).toContain('Voight-Kampff');
      expect(parseFloat(profileGetRes.body.student.cgpa)).toBe(9.35);
    });
  });

  describe('Flow 2: Career Search and Job Application', () => {
    let studentToken;

    it('should complete login -> view jobs -> open job -> apply -> verify status flow successfully', async () => {
      // 1. Sign In Student
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student.demo@campuslink.edu',
          password: 'student123'
        });
      expect(loginRes.status).toBe(200);
      studentToken = loginRes.body.token;

      // 2. Query Active Vacancies Directory
      const jobsListRes = await request(app).get('/api/jobs');
      expect(jobsListRes.status).toBe(200);
      expect(jobsListRes.body.jobs.length).toBeGreaterThan(0);
      const targetJob = jobsListRes.body.jobs[0];

      // 3. Inspect Specific Career Details Page Specs
      const jobDetailRes = await request(app).get(`/api/jobs/${targetJob.id}`);
      expect(jobDetailRes.status).toBe(200);
      expect(jobDetailRes.body.job.id).toBe(targetJob.id);

      // 4. Submit Applications Payload
      const appSubmitRes = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ jobId: targetJob.id });
      
      // If student already applied in a previous run, code preserves integrity or creates new
      expect([211, 400]).toContain(appSubmitRes.status);

      // 5. Audit Applications Dashboard Tracking
      const trackingRes = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(trackingRes.status).toBe(200);
      const appRecord = trackingRes.body.applications.find(a => Number(a.job_id) === Number(targetJob.id));
      expect(appRecord).toBeDefined();
    });
  });

  describe('Flow 3: Candidate Profile Revitalization', () => {
    let studentToken;

    it('should complete login -> update profile -> verify database update flow successfully', async () => {
      // 1. Log In Student
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student.demo@campuslink.edu',
          password: 'student123'
        });
      studentToken = loginRes.body.token;

      // 2. Perform Profile Update
      const uniqueSkillsStr = `Docker, Cloud Security, Testing_${Date.now()}`;
      const updateRes = await request(app)
        .put('/api/users/profile/student')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          cgpa: 9.05,
          skills: uniqueSkillsStr,
          resumeUrl: 'https://campuslink.edu/resumes/modified_resume.pdf'
        });
      expect(updateRes.status).toBe(200);

      // 3. Query Database Records to Verify Persistence
      const verifyRes = await request(app)
        .get('/api/users/profile/student')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.student.skills).toBe(uniqueSkillsStr);
      expect(parseFloat(verifyRes.body.student.cgpa)).toBe(9.05);
    });
  });
});
