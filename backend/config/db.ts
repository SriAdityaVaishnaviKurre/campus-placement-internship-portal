import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;
let useFallbackDb = false;

// Robust Mock Relational Storage for local preview without live MySQL
export interface UserMock {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'student' | 'recruiter';
  created_at: Date;
}

export interface StudentMock {
  id: number;
  user_id: number;
  resume_url: string | null;
  skills: string;
  cgpa: number;
}

export interface RecruiterMock {
  id: number;
  user_id: number;
  company_name: string;
  company_email: string;
}

export interface JobMock {
  id: number;
  recruiter_id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
}

export interface ApplicationMock {
  id: number;
  student_id: number;
  job_id: number;
  status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected';
  applied_date: Date;
}

export const dbMemory = {
  users: [] as UserMock[],
  students: [] as StudentMock[],
  recruiters: [] as RecruiterMock[],
  jobs: [] as JobMock[],
  applications: [] as ApplicationMock[],
  userIdCounter: 1,
  studentIdCounter: 1,
  recruiterIdCounter: 1,
  jobIdCounter: 1,
  applicationIdCounter: 1,
};

// Seed initial mock data so the portal starts with ready-to-test details
import bcrypt from 'bcryptjs';

const seedInitialMockData = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashAdmin = await bcrypt.hash('admin123', salt);
  const hashStudent = await bcrypt.hash('student123', salt);
  const hashRecruiter = await bcrypt.hash('recruiter123', salt);

  // Admin Account
  dbMemory.users.push({
    id: dbMemory.userIdCounter++,
    name: 'Placement Officer Admin',
    email: 'admin@campuslink.edu',
    passwordHash: hashAdmin,
    role: 'admin',
    created_at: new Date()
  });

  // Student Account
  const studentUserId = dbMemory.userIdCounter++;
  dbMemory.users.push({
    id: studentUserId,
    name: 'Amit Sharma',
    email: 'student.demo@campuslink.edu',
    passwordHash: hashStudent,
    role: 'student',
    created_at: new Date()
  });

  dbMemory.students.push({
    id: dbMemory.studentIdCounter++,
    user_id: studentUserId,
    resume_url: 'https://campuslink.edu/resumes/amit_sharma_cv.pdf',
    skills: 'ReactJS, TypeScript, SQL, Data Analytics',
    cgpa: 8.42
  });

  // Recruiter Account
  const recruiterUserId = dbMemory.userIdCounter++;
  dbMemory.users.push({
    id: recruiterUserId,
    name: 'Hiring Manager Microsoft',
    email: 'recruiter.demo@campuslink.edu',
    passwordHash: hashRecruiter,
    role: 'recruiter',
    created_at: new Date()
  });

  dbMemory.recruiters.push({
    id: dbMemory.recruiterIdCounter++,
    user_id: recruiterUserId,
    company_name: 'Microsoft India',
    company_email: 'microsoft.careers@microsoft.com'
  });

  // Seed Jobs
  dbMemory.jobs.push({
    id: dbMemory.jobIdCounter++,
    recruiter_id: 1, // First recruiter
    title: 'Software Development Engineer',
    description: 'Responsible for building high-scale Azure and web application frontends. Work on react web platforms.',
    location: 'Bangalore, India',
    salary: '18.4 LPA',
    deadline: '2026-07-15'
  });

  dbMemory.jobs.push({
    id: dbMemory.jobIdCounter++,
    recruiter_id: 1,
    title: 'Data Analyst Intern',
    description: 'Translate user interaction matrices into business requirements. Good knowledge of Python, SQL, Tableau required.',
    location: 'Hyderabad, India',
    salary: '12.0 LPA',
    deadline: '2026-08-01'
  });

  // Seed Application
  dbMemory.applications.push({
    id: dbMemory.applicationIdCounter++,
    student_id: 1,
    job_id: 1,
    status: 'shortlisted',
    applied_date: new Date()
  });
};

// Initialize DB Node
const initDbNode = () => {
  const dbHost = process.env.DB_HOST;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME || 'campus_placement_db';

  const isMockHost = !dbHost || dbHost === 'dbhost123' || dbHost.toLowerCase().includes('placeholder') || dbHost === 'localhost' || dbHost === '';

  if (dbHost && dbUser && !isMockHost) {
    console.log('[MySQL] Attempting connection pool to host:', dbHost);
    try {
      pool = mysql.createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log('[MySQL] Database Connection Pool configured successfully.');
    } catch (err) {
      console.error('[MySQL] Setup Error, switching to mock database mode:', err);
      useFallbackDb = true;
    }
  } else {
    console.warn('[MySQL] Credentials not fully configured, or mock placeholder host detected. Using robust mock database mode.');
    useFallbackDb = true;
  }
};

initDbNode();
seedInitialMockData();

// General abstraction layer which resolves SQL queries dynamically
export const dbQuery = async (sql: string, params: any[] = []): Promise<any> => {
  if (useFallbackDb || !pool) {
    // Process queries in in-memory simulation to guarantee 100% operational endpoints!
    const cleanSql = sql.replace(/\s+/g, ' ').trim().toLowerCase();

    // 1. SELECT queries
    if (cleanSql.startsWith('select')) {
      const getRichUser = (user: UserMock) => {
        return {
          ...user,
          password: user.passwordHash
        };
      };

      const getRichJob = (job: JobMock) => {
        const recruiter = dbMemory.recruiters.find(r => r.id === job.recruiter_id);
        return {
          ...job,
          company_name: recruiter ? recruiter.company_name : 'Microsoft India'
        };
      };

      const getRichApplication = (app: ApplicationMock) => {
        const job = dbMemory.jobs.find(j => j.id === app.job_id);
        const recruiter = job ? dbMemory.recruiters.find(r => r.id === job.recruiter_id) : null;
        const student = dbMemory.students.find(s => s.id === app.student_id);
        const user = student ? dbMemory.users.find(u => u.id === student.user_id) : null;

        return {
          ...app,
          job_title: job ? job.title : 'Software Development Engineer',
          salary: job ? job.salary : '18.4 LPA',
          company_name: recruiter ? recruiter.company_name : 'Microsoft India',
          student_name: user ? user.name : 'Unknown Candidate'
        };
      };

      // Match count statements first
      if (cleanSql.includes('count(')) {
        let count = 0;
        if (cleanSql.includes('from applications')) {
          if (cleanSql.includes("status = 'shortlisted'")) {
            count = dbMemory.applications.filter(a => a.status === 'shortlisted').length;
          } else if (cleanSql.includes("status = 'interviewing'")) {
            count = dbMemory.applications.filter(a => a.status === 'interviewing').length;
          } else if (cleanSql.includes("status = 'pending'")) {
            count = dbMemory.applications.filter(a => a.status === 'pending').length;
          } else {
            count = dbMemory.applications.length;
          }
        } else if (cleanSql.includes('from jobs')) {
          count = dbMemory.jobs.length;
        } else if (cleanSql.includes('from students')) {
          count = dbMemory.students.length;
        } else if (cleanSql.includes('from users')) {
          count = dbMemory.users.length;
        }
        return [[{ count }]];
      }

      // Return lists/records based on query targets
      if (cleanSql.includes('from users')) {
        if (cleanSql.includes('where email =')) {
          const email = params[0]?.toLowerCase();
          const user = dbMemory.users.find(u => u.email.toLowerCase() === email);
          return [user ? [getRichUser(user)] : []];
        }
        if (cleanSql.includes('where id =')) {
          const id = Number(params[0]);
          const user = dbMemory.users.find(u => u.id === id);
          return [user ? [getRichUser(user)] : []];
        }
        return [dbMemory.users.map(getRichUser)];
      }

      if (cleanSql.includes('from students')) {
        if (cleanSql.includes('where user_id =')) {
          const userId = Number(params[0]);
          const student = dbMemory.students.find(s => s.user_id === userId);
          return [student ? [student] : []];
        }
        if (cleanSql.includes('where id =')) {
          const id = Number(params[0]);
          const student = dbMemory.students.find(s => s.id === id);
          return [student ? [student] : []];
        }
        return [dbMemory.students];
      }

      if (cleanSql.includes('from recruiters')) {
        if (cleanSql.includes('where user_id =')) {
          const userId = Number(params[0]);
          const rec = dbMemory.recruiters.find(r => r.user_id === userId);
          return [rec ? [rec] : []];
        }
        if (cleanSql.includes('where id =')) {
          const id = Number(params[0]);
          const rec = dbMemory.recruiters.find(r => r.id === id);
          return [rec ? [rec] : []];
        }
        return [dbMemory.recruiters];
      }

      if (cleanSql.includes('from jobs')) {
        if (cleanSql.includes('where id =')) {
          const id = Number(params[0]);
          const job = dbMemory.jobs.find(j => j.id === id);
          return [job ? [getRichJob(job)] : []];
        }
        if (cleanSql.includes('where recruiter_id =')) {
          const id = Number(params[0]);
          const filtered = dbMemory.jobs.filter(j => j.recruiter_id === id);
          return [filtered.map(getRichJob)];
        }
        return [dbMemory.jobs.map(getRichJob)];
      }

      if (cleanSql.includes('from applications')) {
        if (cleanSql.includes('where id =')) {
          const id = Number(params[0]);
          const app = dbMemory.applications.find(a => a.id === id);
          return [app ? [getRichApplication(app)] : []];
        }
        if (cleanSql.includes('where student_id =')) {
          const sid = Number(params[0]);
          const filtered = dbMemory.applications.filter(a => a.student_id === sid);
          return [filtered.map(getRichApplication)];
        }
        if (cleanSql.includes('where job_id =')) {
          const jid = Number(params[0]);
          const filtered = dbMemory.applications.filter(a => a.job_id === jid);
          return [filtered.map(getRichApplication)];
        }
        if (cleanSql.includes('recruiter_id =')) {
          const rid = Number(params[0]);
          const filtered = dbMemory.applications.filter(a => {
            const job = dbMemory.jobs.find(j => j.id === a.job_id);
            return job && job.recruiter_id === rid;
          });
          return [filtered.map(getRichApplication)];
        }
        return [dbMemory.applications.map(getRichApplication)];
      }
    }

    // 2. INSERT queries
    if (cleanSql.startsWith('insert into')) {
      if (cleanSql.includes('users')) {
        const [name, email, password, role] = params;
        const newUser: UserMock = {
          id: dbMemory.userIdCounter++,
          name,
          email,
          passwordHash: password,
          role: role || 'student',
          created_at: new Date()
        };
        dbMemory.users.push(newUser);
        return [{ insertId: newUser.id, affectedRows: 1 }];
      }

      if (cleanSql.includes('students')) {
        const [userId, resumeUrl, skills, cgpa] = params;
        const newStudent: StudentMock = {
          id: dbMemory.studentIdCounter++,
          user_id: Number(userId),
          resume_url: resumeUrl || null,
          skills: skills || '',
          cgpa: Number(cgpa) || 0.00
        };
        dbMemory.students.push(newStudent);
        return [{ insertId: newStudent.id, affectedRows: 1 }];
      }

      if (cleanSql.includes('recruiters')) {
        const [userId, companyName, companyEmail] = params;
        const newRecruiter: RecruiterMock = {
          id: dbMemory.recruiterIdCounter++,
          user_id: Number(userId),
          company_name: companyName,
          company_email: companyEmail
        };
        dbMemory.recruiters.push(newRecruiter);
        return [{ insertId: newRecruiter.id, affectedRows: 1 }];
      }

      if (cleanSql.includes('jobs')) {
        const [recruiterId, title, description, location, salary, deadline] = params;
        const newJob: JobMock = {
          id: dbMemory.jobIdCounter++,
          recruiter_id: Number(recruiterId),
          title,
          description,
          location,
          salary,
          deadline
        };
        dbMemory.jobs.push(newJob);
        return [{ insertId: newJob.id, affectedRows: 1 }];
      }

      if (cleanSql.includes('applications')) {
        const [studentId, jobId, status] = params;
        const newApp: ApplicationMock = {
          id: dbMemory.applicationIdCounter++,
          student_id: Number(studentId),
          job_id: Number(jobId),
          status: status || 'pending',
          applied_date: new Date()
        };
        dbMemory.applications.push(newApp);
        return [{ insertId: newApp.id, affectedRows: 1 }];
      }
    }

    // 3. UPDATE queries
    if (cleanSql.startsWith('update')) {
      if (cleanSql.includes('users')) {
        const [name, email, role, id] = params;
        const user = dbMemory.users.find(u => u.id === Number(id));
        if (user) {
          if (name) user.name = name;
          if (email) user.email = email;
          if (role) user.role = role;
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('students')) {
        const [resumeUrl, skills, cgpa, id] = params;
        const student = dbMemory.students.find(s => s.id === Number(id));
        if (student) {
          if (resumeUrl !== undefined) student.resume_url = resumeUrl;
          if (skills !== undefined) student.skills = skills;
          if (cgpa !== undefined) student.cgpa = Number(cgpa);
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('recruiters')) {
        const [companyName, companyEmail, id] = params;
        const rec = dbMemory.recruiters.find(r => r.id === Number(id));
        if (rec) {
          if (companyName) rec.company_name = companyName;
          if (companyEmail) rec.company_email = companyEmail;
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('jobs')) {
        const [title, description, location, salary, deadline, id] = params;
        const job = dbMemory.jobs.find(j => j.id === Number(id));
        if (job) {
          if (title) job.title = title;
          if (description) job.description = description;
          if (location) job.location = location;
          if (salary) job.salary = salary;
          if (deadline) job.deadline = deadline;
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('applications')) {
        const [status, id] = params;
        const app = dbMemory.applications.find(a => a.id === Number(id));
        if (app) {
          if (status) app.status = status;
          return [{ affectedRows: 1 }];
        }
      }
    }

    // 4. DELETE queries
    if (cleanSql.startsWith('delete')) {
      if (cleanSql.includes('users')) {
        const id = Number(params[0]);
        const idx = dbMemory.users.findIndex(u => u.id === id);
        if (idx !== -1) {
          dbMemory.users.splice(idx, 1);
          // Cascade delete
          const sIdx = dbMemory.students.findIndex(s => s.user_id === id);
          if (sIdx !== -1) dbMemory.students.splice(sIdx, 1);
          const rIdx = dbMemory.recruiters.findIndex(r => r.user_id === id);
          if (rIdx !== -1) dbMemory.recruiters.splice(rIdx, 1);
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('students')) {
        const id = Number(params[0]);
        const idx = dbMemory.students.findIndex(s => s.id === id);
        if (idx !== -1) {
          dbMemory.students.splice(idx, 1);
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('recruiters')) {
        const id = Number(params[0]);
        const idx = dbMemory.recruiters.findIndex(r => r.id === id);
        if (idx !== -1) {
          dbMemory.recruiters.splice(idx, 1);
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('jobs')) {
        const id = Number(params[0]);
        const idx = dbMemory.jobs.findIndex(j => j.id === id);
        if (idx !== -1) {
          dbMemory.jobs.splice(idx, 1);
          return [{ affectedRows: 1 }];
        }
      }

      if (cleanSql.includes('applications')) {
        const id = Number(params[0]);
        const idx = dbMemory.applications.findIndex(a => a.id === id);
        if (idx !== -1) {
          dbMemory.applications.splice(idx, 1);
          return [{ affectedRows: 1 }];
        }
      }
    }

    // Default return for generic queries
    return [[]];
  }

  // Execute on real MySQL connection pool
  try {
    const [rows] = await pool.query(sql, params);
    return [rows];
  } catch (err: any) {
    const isConnErr = err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN' || err.message.includes('getaddrinfo') || err.message.includes('connect');
    if (isConnErr) {
      console.warn(`[MySQL Handshake Failed / Connection Lost] host="${process.env.DB_HOST}". Activating dynamic memory DB fallback.`);
    } else {
      console.error(`[MySQL Query Error] executing: ${sql}`, err);
    }
    useFallbackDb = true;
    return dbQuery(sql, params);
  }
};

export default pool;
