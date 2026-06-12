import { dbQuery } from '../config/db';

export interface JobDTO {
  id: number;
  recruiter_id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
  company_name?: string; // Opt joined metadata
}

export const JobModel = {
  // Create a new job posting
  async create(recruiterId: number, title: string, description: string, location: string, salary: string, deadline: string): Promise<number> {
    const sql = `INSERT INTO jobs (recruiter_id, title, description, location, salary, deadline) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await dbQuery(sql, [recruiterId, title, description, location, salary, deadline]);
    return result.insertId;
  },

  // View all jobs with recruiter company name joined
  async findAll(): Promise<JobDTO[]> {
    // In real SQL, a JOIN query is used. In our abstraction mock, we will join company details from the recruiters table
    const sql = `SELECT j.*, r.company_name FROM jobs j LEFT JOIN recruiters r ON j.recruiter_id = r.id ORDER BY j.id DESC`;
    const [rows] = await dbQuery(sql);
    return rows;
  },

  // View a single job details
  async findById(id: number): Promise<JobDTO | null> {
    const sql = `SELECT j.*, r.company_name FROM jobs j LEFT JOIN recruiters r ON j.recruiter_id = r.id WHERE j.id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Update specific job
  async update(id: number, title: string, description: string, location: string, salary: string, deadline: string): Promise<boolean> {
    const sql = `UPDATE jobs SET title = ?, description = ?, location = ?, salary = ?, deadline = ? WHERE id = ?`;
    const [result] = await dbQuery(sql, [title, description, location, salary, deadline, id]);
    return result.affectedRows > 0;
  },

  // Delete job post
  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM jobs WHERE id = ?`;
    const [result] = await dbQuery(sql, [id]);
    return result.affectedRows > 0;
  }
};
