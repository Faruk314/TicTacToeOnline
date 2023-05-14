import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isMuted: boolean;
}

const initialState: InitialState = {
  isMuted: true,
};

const soundSlice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
  },
});

export const { toggleMute } = soundSlice.actions;

export default soundSlice.reducer;
