import { dbQuery } from '../config/db';

export interface ApplicationDTO {
  id: number;
  student_id: number;
  job_id: number;
  status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected';
  applied_date?: string;
  student_name?: string;
  job_title?: string;
  company_name?: string;
  salary?: string;
}

export const ApplicationModel = {
  // Apply for a job
  async create(studentId: number, jobId: number, status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected' = 'pending'): Promise<number> {
    const sql = `INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)`;
    const [result] = await dbQuery(sql, [studentId, jobId, status]);
    return result.insertId;
  },

  // Check if student already applied for a job
  async checkDuplicate(studentId: number, jobId: number): Promise<boolean> {
    const sql = `SELECT id FROM applications WHERE student_id = ? AND job_id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [studentId, jobId]);
    return rows.length > 0;
  },

  // Fetch applications (filtered by studentId, recruiterId, or general admin)
  async findByStudentId(studentId: number): Promise<ApplicationDTO[]> {
    const sql = `SELECT a.*, j.title as job_title, r.company_name, j.salary 
                 FROM applications a 
                 JOIN jobs j ON a.job_id = j.id
                 JOIN recruiters r ON j.recruiter_id = r.id
                 WHERE a.student_id = ? 
                 ORDER BY a.id DESC`;
    const [rows] = await dbQuery(sql, [studentId]);
    return rows;
  },

  // Retrieve applications for a recruiter's jobs
  async findByRecruiterId(recruiterId: number): Promise<ApplicationDTO[]> {
    const sql = `SELECT a.*, u.name as student_name, j.title as job_title, j.salary 
                 FROM applications a 
                 JOIN students s ON a.student_id = s.id
                 JOIN users u ON s.user_id = u.id
                 JOIN jobs j ON a.job_id = j.id
                 WHERE j.recruiter_id = ? 
                 ORDER BY a.id DESC`;
    const [rows] = await dbQuery(sql, [recruiterId]);
    return rows;
  },

  // Find single application by ID
  async findById(id: number): Promise<ApplicationDTO | null> {
    const sql = `SELECT * FROM applications WHERE id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Update status of application (recruiter or admin action)
  async updateStatus(id: number, status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected'): Promise<boolean> {
    const sql = `UPDATE applications SET status = ? WHERE id = ?`;
    const [result] = await dbQuery(sql, [status, id]);
    return result.affectedRows > 0;
  },

  // Delete/withdraw application (student, recruiter, or admin action)
  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM applications WHERE id = ?`;
    const [result] = await dbQuery(sql, [id]);
    return result.affectedRows > 0;
  },

  // View placement report statistics (Admin Dashboard)
  async getSummaryReport(): Promise<any> {
    // Standard aggregate count query. In the fall back cache, we can compile manually.
    const [totalApps] = await dbQuery('SELECT COUNT(*) as count FROM applications');
    const [shortlisted] = await dbQuery("SELECT COUNT(*) as count FROM applications WHERE status = 'shortlisted'");
    const [interviewing] = await dbQuery("SELECT COUNT(*) as count FROM applications WHERE status = 'interviewing'");
    const [pending] = await dbQuery("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'");
    const [totalJobs] = await dbQuery('SELECT COUNT(*) as count FROM jobs');
    const [totalStudents] = await dbQuery('SELECT COUNT(*) as count FROM students');

    const tc = totalApps[0]?.count || 0;
    const sc = shortlisted[0]?.count || 0;
    const ic = interviewing[0]?.count || 0;
    const pc = pending[0]?.count || 0;
    const jc = totalJobs[0]?.count || 0;
    const stc = totalStudents[0]?.count || 0;

    return {
      totalApplications: tc,
      shortlistedCount: sc,
      interviewingCount: ic,
      pendingCount: pc,
      totalJobsActive: jc,
      totalStudentsRegistered: stc,
      placementRate: stc > 0 ? ((sc / stc) * 100).toFixed(1) + '%' : '0%'
    };
  }
};
