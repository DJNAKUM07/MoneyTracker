import { db } from './client';
import { Friend, Transaction } from '../types/types';

export async function addFriend(friend: Friend) {
  await db.put('friends', friend);
}

export async function getFriends(): Promise<Friend[]> {
  return db.getAll<Friend>('friends');
}

export async function updateFriend(friend: Friend) {
  await db.put('friends', friend);
}

export async function deleteFriend(friendId: string) {
  await db.delete('friends', friendId);
}

export async function addTransaction(transaction: Transaction) {
  await db.put('transactions', transaction);
}

export async function updateTransaction(transaction: Transaction) {
  await db.put('transactions', transaction);
}

export async function deleteTransaction(transactionId: string) {
  await db.delete('transactions', transactionId);
}

export async function getTransactions(): Promise<Transaction[]> {
  return db.getAllTransactionsSorted();
}