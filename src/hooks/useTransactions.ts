import { useState, useCallback, useEffect } from 'react';
import { Transaction } from '../types/types';
import { transactionsApi } from '../services/api';
import { useAuth } from './useAuth';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const fetchedTransactions = await transactionsApi.getAll();
      // Filter transactions for the current user
      const userTransactions = fetchedTransactions.filter(t => t.userId === user.id);
      setTransactions(userTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (
    friendId: string,
    amount: number,
    description: string,
    type: 'GAVE' | 'RECEIVED' | 'EXPENSE',
    date: Date
  ) => {
    if (!user?.id) {
      setError('You must be logged in to add transactions');
      return;
    }

    try {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        friendId,
        userId: user.id,
        amount,
        description,
        type,
        date: date.toISOString()
      };
      const savedTransaction = await transactionsApi.create(newTransaction);
      setTransactions(prev => [savedTransaction, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
    }
  }, [user?.id]);

  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    if (!user?.id) {
      setError('You must be logged in to update transactions');
      return;
    }

    try {
      if (updatedTransaction.userId !== user.id) {
        throw new Error('Unauthorized to update this transaction');
      }

      await transactionsApi.update(updatedTransaction);
      setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
    }
  }, [user?.id]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    if (!user?.id) {
      setError('You must be logged in to delete transactions');
      return;
    }

    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction || transaction.userId !== user.id) {
        throw new Error('Unauthorized to delete this transaction');
      }

      await transactionsApi.delete(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
    }
  }, [transactions, user?.id]);

  return {
    transactions,
    loading,
    error,
    setError,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}