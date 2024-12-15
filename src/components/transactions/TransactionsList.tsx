import { Friend, Transaction } from "../../types/types";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { formatIndianRupee, formatDate } from "../../utils/format";
import { Select } from "../ui/Select";
import DatePicker from "react-datepicker";
import { useState } from "react";

interface TransactionsListProps {
  transactions: Transaction[];
  friends: Friend[];
  selectedFriendId: string | null;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

export function TransactionsList({
  transactions,
  friends,
  selectedFriendId,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null);

  const getFriendName = (friendId: string) => {
    return friends.find((f) => f.id === friendId)?.name || "Unknown";
  };

  const filteredTransactions = selectedFriendId
    ? transactions.filter((t) => t.friendId === selectedFriendId)
    : transactions;

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEditClick = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleSaveEdit = () => {
    if (editData) {
      onUpdateTransaction(editData);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleDelete = (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      onDeleteTransaction(transactionId);
    }
  };

  const friendOptions = friends.map((friend) => ({
    value: friend.id,
    label: friend.name,
  }));

  return (
    <div className="space-y-4">
      {sortedTransactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {selectedFriendId
            ? "No transactions with this friend yet"
            : "No transactions yet"}
        </div>
      ) : (
        sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            {editingId === transaction.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Friend"
                    value={editData?.friendId || ""}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev
                          ? {
                              ...prev,
                              friendId: e.target.value,
                            }
                          : null
                      )
                    }
                    options={friendOptions}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editData?.amount}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  amount: Number(e.target.value),
                                }
                              : null
                          )
                        }
                        className="pl-8 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editData?.description}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev
                          ? {
                              ...prev,
                              description: e.target.value,
                            }
                          : null
                      )
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <DatePicker
                    selected={editData ? new Date(editData.date) : null}
                    onChange={(date) =>
                      setEditData((prev) =>
                        prev
                          ? {
                              ...prev,
                              date:
                                date?.toISOString() || new Date().toISOString(),
                            }
                          : null
                      )
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dateFormat="dd-MM-yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-2">
                  <label className="relative flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={editData?.type === "GAVE"}
                      onChange={() =>
                        setEditData((prev) =>
                          prev
                            ? {
                                ...prev,
                                type: "GAVE",
                              }
                            : null
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
                    <span className="font-medium text-gray-700">
                      I gave money
                    </span>
                  </label>

                  <label className="relative flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={editData?.type === "RECEIVED"}
                      onChange={() =>
                        setEditData((prev) =>
                          prev
                            ? {
                                ...prev,
                                type: "RECEIVED",
                              }
                            : null
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
                    <span className="font-medium text-gray-700">
                      I received money
                    </span>
                  </label>

                  <label className="relative flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={editData?.type === "EXPENSE"}
                      onChange={() =>
                        setEditData((prev) =>
                          prev
                            ? {
                                ...prev,
                                type: "EXPENSE",
                              }
                            : null
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
                    <span className="font-medium text-gray-700">
                      I spent money
                    </span>
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {transaction.type === "GAVE" ? (
                    <ArrowUpRight
                      className="text-red-500 flex-shrink-0"
                      size={24}
                    />
                  ) : (
                    <ArrowDownLeft
                      className="text-green-500 flex-shrink-0"
                      size={24}
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {getFriendName(transaction.friendId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex flex-col items-end flex-1 sm:flex-initial">
                    <span
                      className={`font-semibold ${
                        transaction.type === "GAVE"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "GAVE" ? "-" : "+"}
                      {formatIndianRupee(transaction.amount)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(transaction)}
                      className="p-1 text-blue-600 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
