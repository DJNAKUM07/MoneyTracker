import { useState, useCallback, useEffect } from 'react';
import { Friend } from '../types/types';
import { friendsApi } from '../services/api';
import { useAuth } from './useAuth';

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFriends = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const fetchedFriends = await friendsApi.getAll();
      // Filter friends for the current user
      const userFriends = fetchedFriends.filter(friend => friend.userId === user.id);
      setFriends(userFriends);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Failed to load friends. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const addFriend = useCallback(async (name: string) => {
    if (!user?.id) {
      setError('You must be logged in to add friends');
      return;
    }

    try {
      const newFriend: Friend = {
        id: crypto.randomUUID(),
        name,
        userId: user.id
      };
      const savedFriend = await friendsApi.create(newFriend);
      setFriends(prevFriends => [...prevFriends, savedFriend]);
    } catch (err) {
      console.error('Error adding friend:', err);
      setError('Failed to add friend. Please try again.');
    }
  }, [user?.id]);

  const updateFriend = useCallback(async (updatedFriend: Friend) => {
    if (!user?.id) {
      setError('You must be logged in to update friends');
      return;
    }

    try {
      // Ensure the friend belongs to the current user
      if (updatedFriend.userId !== user.id) {
        throw new Error('Unauthorized to update this friend');
      }

      await friendsApi.update(updatedFriend);
      setFriends(prevFriends => 
        prevFriends.map(f => f.id === updatedFriend.id ? updatedFriend : f)
      );
    } catch (err) {
      console.error('Error updating friend:', err);
      setError('Failed to update friend. Please try again.');
    }
  }, [user?.id]);

  const deleteFriend = useCallback(async (friendId: string) => {
    if (!user?.id) {
      setError('You must be logged in to delete friends');
      return;
    }

    try {
      // Verify the friend belongs to the current user before deletion
      const friend = friends.find(f => f.id === friendId);
      if (!friend || friend.userId !== user.id) {
        throw new Error('Unauthorized to delete this friend');
      }

      await friendsApi.delete(friendId);
      setFriends(prevFriends => prevFriends.filter(f => f.id !== friendId));
    } catch (err) {
      console.error('Error deleting friend:', err);
      setError('Failed to delete friend. Please try again.');
    }
  }, [friends, user?.id]);

  return {
    friends,
    loading,
    error,
    setError,
    addFriend,
    updateFriend,
    deleteFriend
  };
}