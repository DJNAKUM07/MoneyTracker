import React from "react";
import { Header } from "./layout/Header";
import { ErrorAlert } from "./layout/ErrorAlert";
import { FriendsSection } from "./friends/FriendsSection";
import { TransactionsSection } from "./transactions/TransactionsSection";
import { TotalBalance } from "./TotalBalance";
import { useFriends } from "../hooks/useFriends";
import { useTransactions } from "../hooks/useTransactions";

export function Dashboard() {
  const {
    friends,
    error: friendsError,
    setError: setFriendsError,
    addFriend,
    updateFriend,
    deleteFriend,
  } = useFriends();

  const {
    transactions,
    error: transactionsError,
    setError: setTransactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [selectedFriendId, setSelectedFriendId] = React.useState<string | null>(
    null
  );

  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendId(selectedFriendId === friendId ? null : friendId);
  };

  const error = friendsError || transactionsError;

  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorAlert
        error={error}
        onDismiss={() => {
          setFriendsError(null);
          setTransactionsError(null);
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TotalBalance transactions={transactions} />

            <FriendsSection
              friends={friends}
              transactions={transactions}
              selectedFriendId={selectedFriendId}
              onAddFriend={addFriend}
              onFriendSelect={handleFriendSelect}
              onUpdateFriend={updateFriend}
              onDeleteFriend={deleteFriend}
            />
          </div>

          <TransactionsSection
            friends={friends}
            transactions={transactions}
            selectedFriendId={selectedFriendId}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
            onClearFilter={() => setSelectedFriendId(null)}
          />
        </div>
      </div>
    </div>
  );
}
