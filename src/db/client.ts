import { openDB, DBSchema } from 'idb';
import { Friend, Transaction } from '../types/types';

interface MoneyTrackerDB extends DBSchema {
  friends: {
    key: string;
    value: Friend;
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-date': string };
  };
}

const dbPromise = openDB<MoneyTrackerDB>('money-tracker', 1, {
  upgrade(db) {
    db.createObjectStore('friends', { keyPath: 'id' });
    const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
    transactionStore.createIndex('by-date', 'date');
  },
});

export async function initDb() {
  await dbPromise;
}

export const db = {
  async get<T>(storeName: 'friends' | 'transactions', id: string): Promise<T | undefined> {
    return (await dbPromise).get(storeName, id);
  },
  async getAll<T>(storeName: 'friends' | 'transactions'): Promise<T[]> {
    return (await dbPromise).getAll(storeName);
  },
  async add(storeName: 'friends' | 'transactions', item: Friend | Transaction): Promise<void> {
    await (await dbPromise).add(storeName, item);
  },
  async put(storeName: 'friends' | 'transactions', item: Friend | Transaction): Promise<void> {
    await (await dbPromise).put(storeName, item);
  },
  async delete(storeName: 'friends' | 'transactions', id: string): Promise<void> {
    await (await dbPromise).delete(storeName, id);
  },
  async getAllTransactionsSorted(): Promise<Transaction[]> {
    const db = await dbPromise;
    const tx = db.transaction('transactions', 'readonly');
    const index = tx.store.index('by-date');
    return index.getAll();
  },
};