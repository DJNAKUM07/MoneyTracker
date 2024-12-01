import axios from 'axios';
import { Friend, Transaction } from '../types/types';

// const API_URL = 'http://localhost:3001/api';
const API_URL = 'https://moneytracker-backend-fayp.onrender.com/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    return data;
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
      window.location.href = '/login';
  }
};

export const friendsApi = {
  getAll: async () => {
    const { data } = await api.get<Friend[]>('/friends');
    return data;
  },
  
  create: async (friend: Friend) => {
    const { data } = await api.post<Friend>('/friends', friend);
    return data;
  },
  
  update: async (friend: Friend) => {
    const { data } = await api.put<Friend>(`/friends/${friend.id}`, friend);
    return data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/friends/${id}`);
  },
};

export const transactionsApi = {
  getAll: async () => {
    const { data } = await api.get<Transaction[]>('/transactions');
    return data;
  },
  
  create: async (transaction: Transaction) => {
    const { data } = await api.post<Transaction>('/transactions', transaction);
    return data;
  },
  
  update: async (transaction: Transaction) => {
    const { data } = await api.put<Transaction>(`/transactions/${transaction.id}`, transaction);
    return data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/transactions/${id}`);
  },
};