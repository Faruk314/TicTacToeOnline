export interface User {
  userId: number;
  userName: string;
  email?: string;
  image: string | null;
  score: number;
}

export interface Request {
  senderId: number;
  receiverId: number;
}

export interface PlayerMove {
  row: number;
  col: number;
  gameId: string;
}

interface Players {
  X: User;
  O: User;
}

export interface Message {
  id: string;
  senderName: string;
  message: string;
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
  winner: number | null;
}
