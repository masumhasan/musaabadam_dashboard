import axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from './constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend.bidsrush.com/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(TOKEN_KEY);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const extractError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'An error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred';
};
