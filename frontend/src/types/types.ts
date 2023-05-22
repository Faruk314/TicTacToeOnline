export interface User {
  userId: number;
  userName: string;
  email: string;
  image: string | null;
}

export interface UserRequest extends User {
  id?: number;
  status?: string;
}

export interface FriendRequestStatus {
  status: number;
  sender?: number;
  receiver?: number;
}
