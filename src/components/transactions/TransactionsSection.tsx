import React from 'react';
import { Friend, Transaction } from '../../types/types';
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';
import { X } from 'lucide-react';

interface TransactionsSectionProps {
  friends: Friend[];
  transactions: Transaction[];
  selectedFriendId: string | null;
  onAddTransaction: (
    friendId: string,
    amount: number,
    description: string,
    type: 'GAVE' | 'RECEIVED',
    date: Date
  ) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onClearFilter: () => void;
}

export function TransactionsSection({
  friends,
  transactions,
  selectedFriendId,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onClearFilter,
}: TransactionsSectionProps) {
  const selectedFriend = friends.find(f => f.id === selectedFriendId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">New Transaction</h2>
        <TransactionForm
          friends={friends}
          onAddTransaction={onAddTransaction}
          selectedFriendId={selectedFriendId}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {selectedFriend 
              ? `Transactions with ${selectedFriend.name}`
              : "Recent Transactions"}
          </h2>
          {selectedFriend && (
            <button
              onClick={onClearFilter}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <X size={16} />
              <span className="hidden sm:inline">Clear filter</span>
            </button>
          )}
        </div>
        <TransactionsList
          transactions={transactions}
          friends={friends}
          selectedFriendId={selectedFriendId}
          onUpdateTransaction={onUpdateTransaction}
          onDeleteTransaction={onDeleteTransaction}
        />
      </div>
    </div>
  );
}