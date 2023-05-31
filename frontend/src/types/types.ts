export interface User {
  userId: number;
  userName: string;
  email?: string;
  image: string | null;
  score: number;
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

export interface Message {
  id: string;
  senderName: string;
  message: string;
}

interface Players {
  X: User;
  O: User;
}

export interface Game {
  board: string[][];
  playerTurn: string;
  isGameOver: boolean;
  isRoundOver: boolean;
  message: string;
  players: Players;
  messages: Message[];
  totalRounds: number;
}
