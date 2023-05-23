import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";

interface InitialState {
  gameInviteOpen: boolean;
  inviterInfo: User | null;
  invitePendingMessage: string | null;
  invitePendingModalOpen: boolean;
  roomId: string | null;
}

const initialState: InitialState = {
  gameInviteOpen: false,
  inviterInfo: null,
  invitePendingMessage: null,
  invitePendingModalOpen: false,
  roomId: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    openGameInviteModal(state, action: PayloadAction<User>) {
      state.gameInviteOpen = true;
      state.inviterInfo = action.payload;
    },
    closeGameInviteModal(state) {
      state.gameInviteOpen = false;
    },
    openInvitePendingModal(state, action: PayloadAction<string | null>) {
      state.invitePendingMessage = action.payload;
      state.invitePendingModalOpen = true;
    },
    closeInvitePendingModal(state) {
      state.invitePendingModalOpen = false;
    },
    saveGameRoom(state, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
  },
});

export const {
  openGameInviteModal,
  closeGameInviteModal,
  openInvitePendingModal,
  closeInvitePendingModal,
  saveGameRoom,
} = gameSlice.actions;

export default gameSlice.reducer;
