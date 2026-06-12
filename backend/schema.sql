-- Database Schema for Campus Placement & Internship Portal
-- Supported Database: MySQL 8.x +

CREATE DATABASE IF NOT EXISTS campus_placement_db;
USE campus_placement_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'recruiter') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  resume_url VARCHAR(255) DEFAULT NULL,
  skills TEXT DEFAULT NULL, -- Comma-separated or JSON string of skills
  cgpa DECIMAL(3, 2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Recruiters Table
CREATE TABLE IF NOT EXISTS recruiters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recruiter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(255) NOT NULL, -- e.g., '18.4 LPA' or '12.0 LPA'
  deadline DATE NOT NULL,
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('pending', 'shortlisted', 'interviewing', 'rejected') NOT NULL DEFAULT 'pending',
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_job (student_id, job_id)
);
