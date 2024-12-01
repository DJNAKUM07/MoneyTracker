import { User } from '../../types/types';
import { UserCircle, Mail } from 'lucide-react';

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No users found</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <UserCircle className="text-blue-600 w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-1 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}