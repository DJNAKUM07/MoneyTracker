import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Friend } from "../../types/types";
import { Select } from "../ui/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TransactionFormProps {
  friends: Friend[];
  onAddTransaction: (
    friendId: string,
    amount: number,
    description: string,
    type: "GAVE" | "RECEIVED",
    date: Date
  ) => void;
  selectedFriendId: string | null;
}

export function TransactionForm({
  friends,
  onAddTransaction,
  selectedFriendId,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    friendId: selectedFriendId || "",
    amount: "",
    description: "",
    type: "GAVE" as "GAVE" | "RECEIVED",
    date: new Date(),
  });

  useEffect(() => {
    if (selectedFriendId) {
      setFormData((prev) => ({ ...prev, friendId: selectedFriendId }));
    }
  }, [selectedFriendId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.friendId && formData.amount && formData.description) {
      onAddTransaction(
        formData.friendId,
        Number(formData.amount),
        formData.description,
        formData.type,
        formData.date
      );
      setFormData({
        friendId: selectedFriendId || "",
        amount: "",
        description: "",
        type: "GAVE",
        date: new Date(),
      });
    }
  };

  const friendOptions = friends.map((friend) => ({
    value: friend.id,
    label: friend.name,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Friend"
          value={formData.friendId}
          onChange={(e) =>
            setFormData({ ...formData, friendId: e.target.value })
          }
          options={friendOptions}
          required
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
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="pl-8 block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              step="1"
              required
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
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What was it for?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <DatePicker
          selected={formData.date}
          onChange={(date) =>
            setFormData({ ...formData, date: date || new Date() })
          }
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={15}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="relative flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={formData.type === "GAVE"}
            onChange={() => setFormData({ ...formData, type: "GAVE" })}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
          <span className="font-medium text-gray-700">I gave money</span>
        </label>
        <label className="relative flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={formData.type === "RECEIVED"}
            onChange={() => setFormData({ ...formData, type: "RECEIVED" })}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:border-8 transition-all"></div>
          <span className="font-medium text-gray-700">I received money</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <PlusCircle size={20} />
        Add Transaction
      </button>
    </form>
  );
}
