import React, { useState, useEffect, useRef } from "react";
import { Friend, Transaction } from "../types/types";
import {
  calculateBalance,
  calculateTransactionTotals,
} from "../utils/calculations";
import { formatIndianRupee } from "../utils/format";
import { Pencil, Trash2, X, Check, Search } from "lucide-react";

// Props interface
interface FriendsListProps {
  friends: Friend[];
  transactions: Transaction[];
  onFriendSelect: (friendId: string) => void;
  selectedFriendId: string | null;
  onUpdateFriend: (friend: Friend) => void;
  onDeleteFriend: (friendId: string) => void;
}

export function FriendsList({
  friends,
  transactions,
  onFriendSelect,
  selectedFriendId,
  onUpdateFriend,
  onDeleteFriend,
}: FriendsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loadedFriends, setLoadedFriends] = useState<Friend[]>([]);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter friends based on the search term
  useEffect(() => {
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
    setLoadedFriends([]); // Reset loaded friends when the filter changes
    setPage(1); // Reset pagination
  }, [friends, searchTerm]);

  // Load more friends when the page changes
  useEffect(() => {
    const loadMore = () => {
      const nextPageFriends = filteredFriends.slice((page - 1) * 10, page * 10);
      setLoadedFriends((prev) => [...prev, ...nextPageFriends]);
    };
    loadMore();
  }, [page, filteredFriends]);

  // Lazy loading on scroll
  const handleScroll = () => {
    if (containerRef.current) {
      const bottom =
        containerRef.current.scrollHeight ===
        containerRef.current.scrollTop + containerRef.current.clientHeight;

      if (bottom && !loading && loadedFriends.length < filteredFriends.length) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handleEditClick = (e: React.MouseEvent, friend: Friend) => {
    e.stopPropagation();
    setEditingId(friend.id);
    setEditName(friend.name);
  };

  const handleSaveEdit = (e: React.MouseEvent, friend: Friend) => {
    e.stopPropagation();
    if (editName.trim()) {
      onUpdateFriend({ ...friend, name: editName.trim() });
      setEditingId(null);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, friendId: string) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this friend? All associated transactions will remain."
      )
    ) {
      onDeleteFriend(friendId);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading && loadedFriends.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-md">
        <p>Loading friends...</p>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-10 h-10 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg w-full"
        />
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Search size={18} />
        </button>
      </div>

      {/* Friends List */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="space-y-4 max-h-[500px] overflow-y-auto"
      >
        {loadedFriends.map((friend) => {
          const balance = calculateBalance(transactions, friend.id);
          const { totalGiven, totalReceived } = calculateTransactionTotals(
            transactions,
            friend.id
          );
          const isPositive = balance > 0;
          const isSelected = selectedFriendId === friend.id;
          const isEditing = editingId === friend.id;

          return (
            <div
              key={friend.id}
              onClick={() => onFriendSelect(friend.id)}
              className={`bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 cursor-pointer transition-colors ${
                isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium">{friend.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => handleSaveEdit(e, friend)}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleEditClick(e, friend)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, friend.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-red-600">
                  <div className="font-medium">Given</div>
                  <div className="font-semibold">
                    {formatIndianRupee(totalGiven)}
                  </div>
                </div>
                <div className="text-green-600">
                  <div className="font-medium">Received</div>
                  <div className="font-semibold">
                    {formatIndianRupee(totalReceived)}
                  </div>
                </div>
                <div
                  className={`${
                    isPositive
                      ? "text-green-600"
                      : balance < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  <div className="font-medium">Balance</div>
                  <div className="font-semibold flex items-center gap-1">
                    {isPositive ? "+" : ""}
                    {formatIndianRupee(balance)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="text-center text-gray-500 py-4">Loading more...</div>
        )}
      </div>
    </div>
  );
}
