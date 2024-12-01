import { Friend, Transaction } from "../../types/types";
import { AddFriendForm } from "../AddFriendForm";
import { FriendsList } from "../FriendsList";

interface FriendsSectionProps {
  friends: Friend[];
  transactions: Transaction[];
  selectedFriendId: string | null;
  onAddFriend: (name: string) => void;
  onFriendSelect: (friendId: string) => void;
  onUpdateFriend: (friend: Friend) => void;
  onDeleteFriend: (friendId: string) => void;
}

export function FriendsSection({
  friends,
  transactions,
  selectedFriendId,
  onAddFriend,
  onFriendSelect,
  onUpdateFriend,
  onDeleteFriend,
}: FriendsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Add New Friend
        </h2>
        <AddFriendForm onAddFriend={onAddFriend} />
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Friends & Balances
        </h2>
        <FriendsList
          friends={friends}
          transactions={transactions}
          onFriendSelect={onFriendSelect}
          selectedFriendId={selectedFriendId}
          onUpdateFriend={onUpdateFriend}
          onDeleteFriend={onDeleteFriend}
        />
      </div>
    </div>
  );
}
