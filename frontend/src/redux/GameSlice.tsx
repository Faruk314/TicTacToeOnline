import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";

interface InitialState {
  gameInviteOpen: boolean;
  inviterInfo: User | null;
  invitePendingMessage: string | null;
  invitePendingModalOpen: boolean;
}

const initialState: InitialState = {
  gameInviteOpen: false,
  inviterInfo: null,
  invitePendingMessage: null,
  invitePendingModalOpen: false,
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
      state.inviterInfo = null;
    },
    openInvitePendingModal(state, action: PayloadAction<string | null>) {
      state.invitePendingMessage = action.payload;
      state.invitePendingModalOpen = true;
    },
    closeInvitePendingModal(state) {
      state.invitePendingMessage = null;
      state.invitePendingModalOpen = false;
    },
  },
});

export const {
  openGameInviteModal,
  closeGameInviteModal,
  openInvitePendingModal,
  closeInvitePendingModal,
} = gameSlice.actions;

export default gameSlice.reducer;
