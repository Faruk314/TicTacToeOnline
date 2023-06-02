import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "../types/types";
import axios from "axios";

interface InitialState {
  gameInviteOpen: boolean;
  otherPlayerInfo: User | null;
  invitePendingModalOpen: boolean;
  roomId: string | null;
  messages: Message[];
  board: string[][];
  playerTurn: string | null;
  isGameOver: boolean;
  playersStats: {
    X: { userId: number; score: number };
    O: { userId: number; score: number };
  } | null;
  isRoundOver: boolean;
  winner: number | null;
  totalRounds: number | null;
  gameLeaveOpen: boolean;
}

const initialState: InitialState = {
  board: [],
  gameInviteOpen: false,
  otherPlayerInfo: null,
  invitePendingModalOpen: false,
  roomId: JSON.parse(localStorage.getItem("gameId") || "null"),
  messages: [],
  playerTurn: null,
  isGameOver: false,
  playersStats: null,
  isRoundOver: false,
  winner: null,
  totalRounds: null,
  gameLeaveOpen: false,
};

export const updateLeaderboard = createAsyncThunk(
  "game/updateLeaderboard",
  async (winnerId: number) => {
    try {
      await axios.post(`http://localhost:4000/api/game/updateLeaderboard`);
    } catch (error: any) {
      console.log(error);
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    openGameInviteModal(state, action: PayloadAction<boolean>) {
      state.gameInviteOpen = action.payload;
    },

    openInvitePendingModal(state, action: PayloadAction<boolean>) {
      state.invitePendingModalOpen = action.payload;
    },
    closeInvitePendingModal(state) {
      state.invitePendingModalOpen = false;
    },
    saveGameRoom(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
      localStorage.setItem("gameId", JSON.stringify(action.payload));
    },
    saveMessage(state, action: PayloadAction<Message>) {
      state.messages = [...state.messages, action.payload];
    },
    setBoard(state, action: PayloadAction<string[][]>) {
      state.board = action.payload;
    },
    setPlayerTurn(state, action: PayloadAction<string>) {
      state.playerTurn = action.payload;
    },
    setGameOver(state, action: PayloadAction<boolean>) {
      state.isGameOver = action.payload;
    },
    setOtherPlayerInfo(state, action: PayloadAction<User>) {
      state.otherPlayerInfo = action.payload;
    },
    setPlayerStats(
      state,
      action: PayloadAction<{
        X: { userId: number; score: number };
        O: { userId: number; score: number };
      }>
    ) {
      state.playersStats = action.payload;
    },
    retrieveMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setRoundState(state, action: PayloadAction<boolean>) {
      state.isRoundOver = action.payload;
    },
    setWinner(state, action: PayloadAction<number | null>) {
      state.winner = action.payload;
    },
    setTotalRounds(state, action: PayloadAction<number>) {
      state.totalRounds = action.payload;
    },
    setGameLeaveOpen(state, action: PayloadAction<boolean>) {
      state.gameLeaveOpen = action.payload;
    },
  },
});

export const {
  openGameInviteModal,

  openInvitePendingModal,
  closeInvitePendingModal,
  saveGameRoom,
  saveMessage,
  setBoard,
  setPlayerTurn,
  setGameOver,
  setOtherPlayerInfo,
  setPlayerStats,
  retrieveMessages,
  setRoundState,
  setWinner,
  setTotalRounds,
  setGameLeaveOpen,
} = gameSlice.actions;

export default gameSlice.reducer;
