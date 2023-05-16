import { configureStore } from "@reduxjs/toolkit";
import soundReducer from "./SoundSlice";
import authReducer from "./AuthSlice";
import friendReducer from "./FriendSlice";

const store = configureStore({
  reducer: {
    sound: soundReducer,
    auth: authReducer,
    friend: friendReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
