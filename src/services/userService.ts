import api from './api';

export interface StudentProfilePayload {
  resumeUrl: string | null;
  skills: string;
  cgpa: number;
}

export interface RecruiterProfilePayload {
  companyName: string;
  companyEmail: string;
}

export const userService = {
  // --- Student profile ---
  async getStudentProfile() {
    const response = await api.get('/users/profile/student');
    return response.data.student;
  },

  async createStudentProfile(payload: StudentProfilePayload) {
    const response = await api.post('/users/profile/student', payload);
    return response.data;
  },

  async updateStudentProfile(payload: StudentProfilePayload) {
    const response = await api.put('/users/profile/student', payload);
    return response.data;
  },

  async deleteStudentProfile() {
    const response = await api.delete('/users/profile/student');
    return response.data;
  },

  // --- Recruiter details ---
  async getRecruiterProfile() {
    const response = await api.get('/users/profile/recruiter');
    return response.data.recruiter;
  },

  async createRecruiterProfile(payload: RecruiterProfilePayload) {
    const response = await api.post('/users/profile/recruiter', payload);
    return response.data;
  },

  async updateRecruiterProfile(payload: RecruiterProfilePayload) {
    const response = await api.put('/users/profile/recruiter', payload);
    return response.data;
  },

  async deleteRecruiterProfile() {
    const response = await api.delete('/users/profile/recruiter');
    return response.data;
  },

  // --- Admin User management directory view ---
  async getAllUsers() {
    const response = await api.get('/users/admin/users');
    return response.data.users;
  }
};
