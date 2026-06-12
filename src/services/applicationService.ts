import api from './api';

export const applicationService = {
  // Submit resume module application to job
  async applyForJob(jobId: number | string) {
    const response = await api.post('/applications', { jobId });
    return response.data;
  },

  // View applications under context
  async getApplications() {
    const response = await api.get('/applications');
    return response.data.applications;
  },

  // Update applicant pipeline status (recruiter / admin action)
  async updateStatus(id: number | string, status: 'pending' | 'shortlisted' | 'interviewing' | 'rejected') {
    const response = await api.put(`/applications/${id}`, { status });
    return response.data;
  },

  // Delete/Withdraw application submission
  async deleteApplication(id: number | string) {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  // View placement report statistics (Admin Only)
  async getReports() {
    const response = await api.get('/applications/admin/reports');
    return response.data.report;
  }
};
