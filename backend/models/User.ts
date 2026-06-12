import { dbQuery } from '../config/db';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'recruiter';
  created_at?: string;
}

export interface StudentDTO {
  id: number;
  user_id: number;
  resume_url: string | null;
  skills: string;
  cgpa: number;
}

export interface RecruiterDTO {
  id: number;
  user_id: number;
  company_name: string;
  company_email: string;
}

export const UserModel = {
  // Create account
  async create(name: string, email: string, passwordHash: string, role: 'admin' | 'student' | 'recruiter'): Promise<number> {
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    const [result] = await dbQuery(sql, [name, email, passwordHash, role]);
    return result.insertId;
  },

  // Find user based on email (login check)
  async findByEmail(email: string): Promise<any | null> {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Find user details by user ID
  async findById(id: number): Promise<any | null> {
    const sql = `SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Delete specific user record
  async delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await dbQuery(sql, [id]);
    return result.affectedRows > 0;
  },

  // Admin select list of all user templates
  async findAll(): Promise<UserDTO[]> {
    const sql = `SELECT id, name, email, role, created_at FROM users ORDER BY id ASC`;
    const [rows] = await dbQuery(sql);
    return rows;
  },

  // Student profile operations
  async createStudentProfile(userId: number, resumeUrl: string | null, skills: string, cgpa: number): Promise<number> {
    const sql = `INSERT INTO students (user_id, resume_url, skills, cgpa) VALUES (?, ?, ?, ?)`;
    const [result] = await dbQuery(sql, [userId, resumeUrl, skills, cgpa]);
    return result.insertId;
  },

  async findStudentByUserId(userId: number): Promise<StudentDTO | null> {
    const sql = `SELECT * FROM students WHERE user_id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [userId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async updateStudentProfile(userId: number, resumeUrl: string | null, skills: string, cgpa: number): Promise<boolean> {
    // Locate student record
    const student = await this.findStudentByUserId(userId);
    if (!student) return false;
    const sql = `UPDATE students SET resume_url = ?, skills = ?, cgpa = ? WHERE id = ?`;
    const [result] = await dbQuery(sql, [resumeUrl, skills, cgpa, student.id]);
    return result.affectedRows > 0;
  },

  async deleteStudentProfile(userId: number): Promise<boolean> {
    const student = await this.findStudentByUserId(userId);
    if (!student) return false;
    const sql = `DELETE FROM students WHERE id = ?`;
    const [result] = await dbQuery(sql, [student.id]);
    return result.affectedRows > 0;
  },

  // Recruiter profile operations
  async createRecruiterProfile(userId: number, companyName: string, companyEmail: string): Promise<number> {
    const sql = `INSERT INTO recruiters (user_id, company_name, company_email) VALUES (?, ?, ?)`;
    const [result] = await dbQuery(sql, [userId, companyName, companyEmail]);
    return result.insertId;
  },

  async findRecruiterByUserId(userId: number): Promise<RecruiterDTO | null> {
    const sql = `SELECT * FROM recruiters WHERE user_id = ? LIMIT 1`;
    const [rows] = await dbQuery(sql, [userId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async updateRecruiterProfile(userId: number, companyName: string, companyEmail: string): Promise<boolean> {
    const rec = await this.findRecruiterByUserId(userId);
    if (!rec) return false;
    const sql = `UPDATE recruiters SET company_name = ?, company_email = ? WHERE id = ?`;
    const [result] = await dbQuery(sql, [companyName, companyEmail, rec.id]);
    return result.affectedRows > 0;
  },

  async deleteRecruiterProfile(userId: number): Promise<boolean> {
    const rec = await this.findRecruiterByUserId(userId);
    if (!rec) return false;
    const sql = `DELETE FROM recruiters WHERE id = ?`;
    const [result] = await dbQuery(sql, [rec.id]);
    return result.affectedRows > 0;
  }
};
