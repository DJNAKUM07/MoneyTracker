export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Friend {
  id: string;
  name: string;
  userId: string;
}

export interface Transaction {
  id: string;
  friendId: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
  type: 'GAVE' | 'RECEIVED';
}

export interface FriendBalance {
  friendId: string;
  balance: number;
}