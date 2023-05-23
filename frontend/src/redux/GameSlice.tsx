import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  gameInviteOpen: boolean;
}

const initialState: InitialState = {
  gameInviteOpen: true,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameInviteModal(state, action) {
      state.gameInviteOpen = action.payload;
    },
  },
});

export const { setGameInviteModal } = gameSlice.actions;

export default gameSlice.reducer;
