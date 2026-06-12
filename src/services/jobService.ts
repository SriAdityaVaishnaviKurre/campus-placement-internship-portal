import api from './api';

export interface JobPayload {
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
}

export const jobService = {
  // Fetch featured and general active jobs
  async getAllJobs() {
    const response = await api.get('/jobs');
    return response.data.jobs;
  },

  // View specific job
  async getJobById(id: number | string) {
    const response = await api.get(`/jobs/${id}`);
    return response.data.job;
  },

  // Create job (Recruiter/Admin)
  async createJob(payload: JobPayload & { recruiterId?: number }) {
    const response = await api.post('/jobs', payload);
    return response.data;
  },

  // Update job parameters
  async updateJob(id: number | string, payload: Partial<JobPayload>) {
    const response = await api.put(`/jobs/${id}`, payload);
    return response.data;
  },

  // Delete/Deactivate job posting
  async deleteJob(id: number | string) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
