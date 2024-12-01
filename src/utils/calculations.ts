// import { Transaction } from '../types/types';

// export const calculateTotalGivenToFriend = (transactions: Transaction[], friendId: string): { totalGiven: number, givenCount: number } => {
//   // Filter the transactions for the given friend
//   const givenTransactions = transactions.filter(
//     (transaction) => transaction.friendId === friendId && transaction.type === 'GAVE'
//   );

//   // Calculate total given and count of transactions
//   const totalGiven = givenTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
//   const givenCount = givenTransactions.length;

//   return { totalGiven, givenCount };
// };

// export const calculateTotalReceivedFromFriend = (transactions: Transaction[], friendId: string): { totalReceived: number, receivedCount: number } => {
//   // Filter the transactions for the given friend
//   const receivedTransactions = transactions.filter(
//     (transaction) => transaction.friendId === friendId && transaction.type === 'RECEIVED'
//   );

//   // Calculate total received and count of transactions
//   const totalReceived = receivedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
//   const receivedCount = receivedTransactions.length;

//   return { totalReceived, receivedCount };
// };



// export const calculateTotalGiven = (transactions: Transaction[]): number => {
//   return transactions.reduce((total, transaction) => {
//     return total + (transaction.type === 'GAVE' ? transaction.amount : 0);
//   }, 0);
// };

// export const calculateTotalReceived = (transactions: Transaction[]): number => {
//   return transactions.reduce((total, transaction) => {
//     return total + (transaction.type === 'RECEIVED' ? transaction.amount : 0);
//   }, 0);
// };

// export const calculateBalance = (transactions: Transaction[], friendId: string): number => {
//   return transactions.reduce((balance, transaction) => {
//     if (transaction.friendId !== friendId) return balance;
//     return transaction.type === 'GAVE' 
//       ? balance + transaction.amount 
//       : balance - transaction.amount;
//   }, 0);
// };

// export const calculateTotalOwed = (transactions: Transaction[]): number => {
//   return transactions.reduce((total, transaction) => {
//     return total + (transaction.type === 'GAVE' ? transaction.amount : -transaction.amount);
//   }, 0);
// };

import { Transaction } from '../types/types';

export const calculateBalance = (transactions: Transaction[], friendId: string): number => {
  return transactions.reduce((balance, transaction) => {
    if (transaction.friendId !== friendId) return balance;
    return transaction.type === 'GAVE' 
      ? balance + transaction.amount 
      : balance - transaction.amount;
  }, 0);
};

export const calculateTotalOwed = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return total + (transaction.type === 'GAVE' ? transaction.amount : -transaction.amount);
  }, 0);
};

export const calculateTransactionTotals = (transactions: Transaction[], friendId?: string) => {
  const filteredTransactions = friendId 
    ? transactions.filter(t => t.friendId === friendId)
    : transactions;

  return filteredTransactions.reduce((totals, transaction) => {
    if (transaction.type === 'GAVE') {
      totals.totalGiven += transaction.amount;
    } else {
      totals.totalReceived += transaction.amount;
    }
    return totals;
  }, {
    totalGiven: 0,
    totalReceived: 0,
    balance: 0
  });
};