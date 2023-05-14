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
    playClickSound: (state, action) => {
      if (!state.isMuted) {
        const audio = new Audio(action.payload);
        audio.play();
      }
    },
  },
});

export const { toggleMute, playClickSound } = soundSlice.actions;

export default soundSlice.reducer;
