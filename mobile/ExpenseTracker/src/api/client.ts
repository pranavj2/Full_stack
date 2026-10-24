import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
