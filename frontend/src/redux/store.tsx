import { configureStore } from "@reduxjs/toolkit";
import soundReducer from "./SoundSlice";
import authReducer from "./AuthSlice";
import friendReducer from "./FriendSlice";
import gameReducer from "./GameSlice";

const store = configureStore({
  reducer: {
    sound: soundReducer,
    auth: authReducer,
    friend: friendReducer,
    game: gameReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
