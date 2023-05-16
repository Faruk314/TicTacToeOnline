import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { UserRequest } from "../types/types";

// router.get("/getFriendRequests", protect, getFriendRequests);

// router.get("/getFriends", protect, getFriends);

// router.post("/sendFriendRequest", protect, sendFriendRequest);

// router.put("/acceptFriendRequest", protect, acceptFriendRequest);

// router.post("/checkFriendRequestStatus", protect, checkFriendRequestStatus);

// router.put("/deleteFriendRequest", protect, deleteFriendRequest);

interface InitialState {
  friends: UserRequest[];
  friendRequests: UserRequest[];
}

const initialState: InitialState = {
  friends: [],
  friendRequests: [],
};

export const getFriends = createAsyncThunk("friend/getFriends", async () => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/friends/getFriends`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const getFriendRequests = createAsyncThunk(
  "friend/getFriendRequests",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/friends/getFriendRequests`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getFriends.fulfilled,
      (state, action: PayloadAction<UserRequest[]>) => {
        state.friends = action.payload;

        console.log(state.friends);
      }
    );
    builder.addCase(
      getFriendRequests.fulfilled,
      (state, action: PayloadAction<UserRequest[]>) => {
        state.friendRequests = action.payload;

        console.log("friendRequests", state.friendRequests);
      }
    );
  },
});
export const {} = friendSlice.actions;

export default friendSlice.reducer;
