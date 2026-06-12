import api from './api';

export interface UserCreds {
  name?: string;
  email: string;
  password?: string;
  role?: 'student' | 'recruiter' | 'admin';
}

export const authService = {
  // Register user
  async register(data: UserCreds) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user and get token
  async login(data: UserCreds) {
    const response = await api.post('/auth/login', data);
    return response.data; // Includes message, token, user
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};
