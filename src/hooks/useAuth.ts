import { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { User } from '../types/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setUser({
        id: userId,
        name: '', // We'll fetch this if needed
        email: '' // We'll fetch this if needed
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { user } = await authApi.login(email, password);
      setUser(user);
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const { user } = await authApi.register({ name, email, password });
      setUser(user);
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
}