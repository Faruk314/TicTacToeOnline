export interface User {
  userId: number;
  userName: string;
  email: string;
  image: string | null;
}

export interface Request {
  senderId: number;
  receiverId: number;
}
