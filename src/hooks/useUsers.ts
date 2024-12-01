import { useState, useCallback } from 'react';
import { User } from '../types/types';
import { usersApi } from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addUser = useCallback(async (name: string, email: string, password: string) => {
    try {
      const newUser = await usersApi.create({ name, email, password });
      setUsers([...users, newUser]);
      return newUser;
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again.');
      throw err;
    }
  }, [users]);

  const getUsers = useCallback(async () => {
    try {
      const fetchedUsers = await usersApi.getAll();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    }
  }, []);

  return {
    users,
    error,
    setError,
    addUser,
    getUsers
  };
}