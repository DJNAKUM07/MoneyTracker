import { Wallet } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { logout } = useAuth();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Wallet size={32} className="text-blue-600" />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Money Tracker
      </h1>

      {/* Log Out Button */}
      <button
        onClick={logout}
        className="ml-auto py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Log Out
      </button>
    </div>
  );
}
