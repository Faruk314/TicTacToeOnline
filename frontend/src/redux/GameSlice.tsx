import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";

interface InitialState {
  gameInviteOpen: boolean;
  inviterInfo: User | null;
}

const initialState: InitialState = {
  gameInviteOpen: false,
  inviterInfo: null,
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
  },
});

export const { openGameInviteModal, closeGameInviteModal } = gameSlice.actions;

export default gameSlice.reducer;
