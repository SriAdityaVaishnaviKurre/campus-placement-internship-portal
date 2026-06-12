import axios from 'axios';

// Central AXIOS configuration for CampusLink Placement Portal (Week 4)
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically append session JWT tokens to every outgoing authorization request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neo_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle system error exceptions uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.error || error.response?.data?.message || 'A network communication timeout has occurred.',
      status: error.response?.status || 500,
    };
    
    console.error('[AXIOS INTERCEPTOR ERROR]:', customError);
    return Promise.reject(customError);
  }
);

export default api;
