import { Transaction } from '../types/types';

export const calculateBalance = (transactions: Transaction[], friendId: string): number => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.friendId !== friendId) return balance;
    return  transaction.type === 'GAVE'     ? balance + transaction.amount 
          : transaction.type === 'RECEIVED' ? balance - transaction.amount : 0 ;
  }, 0);
};

export const calculateTotalOwed = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    // return total + (transaction.type === 'GAVE' ? transaction.amount : -transaction.amount);
    return total + (transaction.type === 'GAVE' ? transaction.amount : transaction.type === 'RECEIVED' ? - transaction.amount : 0);
  }, 0);
};

export const calculateTransactionTotals = (transactions: Transaction[], friendId?: string) => {
  const filteredTransactions = friendId 
    ? transactions.filter(t => t.friendId === friendId)
    : transactions;

  return filteredTransactions.reduce((totals, transaction) => {
    if (transaction.type === 'GAVE') {
      totals.totalGiven += transaction.amount;
    } else if (transaction.type === 'RECEIVED') {
      totals.totalReceived += transaction.amount;
    }
    
    return totals;
  }, {
    totalGiven: 0,
    totalReceived: 0,
    balance: 0
  });
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'EXPENSE' ? total + transaction.amount : total;
  }, 0);
};
