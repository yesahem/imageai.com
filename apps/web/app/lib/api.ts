import axios from 'axios';
import { BACKEND_URL } from '@/config';

export const api = axios.create({
  baseURL: BACKEND_URL,
});

// Add a request interceptor to add the auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
