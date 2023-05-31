import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "../types/types";

interface InitialState {
  gameInviteOpen: boolean;
  otherPlayerInfo: User | null;
  invitePendingModalOpen: boolean;
  roomId: string | null;
  messages: Message[];
  board: string[][];
  playerTurn: string | null;
  isGameOver: boolean;
  simbols: { X: { userId: number }; O: { userId: number } } | null;
  isRoundOver: boolean;
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
  simbols: null,
  isRoundOver: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    openGameInviteModal(state, action: PayloadAction<User>) {
      state.gameInviteOpen = true;
      state.otherPlayerInfo = action.payload;
    },
    closeGameInviteModal(state) {
      state.gameInviteOpen = false;
    },
    openInvitePendingModal(state, action: PayloadAction<User>) {
      state.otherPlayerInfo = action.payload;
      state.invitePendingModalOpen = true;
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
        X: { userId: number; score?: number };
        O: { userId: number; score?: number };
      }>
    ) {
      state.simbols = action.payload;
    },
    retrieveMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setRoundState(state, action: PayloadAction<boolean>) {
      state.isRoundOver = action.payload;
    },
  },
});

export const {
  openGameInviteModal,
  closeGameInviteModal,
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
} = gameSlice.actions;

export default gameSlice.reducer;
