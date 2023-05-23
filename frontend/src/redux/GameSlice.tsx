import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User } from "../types/types";

interface InitialState {
  gameInviteOpen: boolean;
  otherPlayerInfo: User | null;
  invitePendingModalOpen: boolean;
  roomId: string | null;
  messages: Message[];
}

const initialState: InitialState = {
  gameInviteOpen: false,
  otherPlayerInfo: null,
  invitePendingModalOpen: false,
  roomId: null,
  messages: [],
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
    },
    saveMessage(state, action: PayloadAction<Message>) {
      state.messages = [...state.messages, action.payload];
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
} = gameSlice.actions;

export default gameSlice.reducer;
