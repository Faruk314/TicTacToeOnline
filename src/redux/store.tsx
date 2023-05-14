import { configureStore } from "@reduxjs/toolkit";
import soundReducer from "./SoundSlice";

const store = configureStore({
  reducer: {
    sound: soundReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
