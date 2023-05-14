import { configureStore } from "@reduxjs/toolkit";
import soundReducer from "./SoundSlice";
import authReducer from "./AuthSlice";

const store = configureStore({
  reducer: {
    sound: soundReducer,
    auth: authReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
