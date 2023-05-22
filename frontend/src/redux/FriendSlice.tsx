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
  friendRequestStatus: number;
}

const initialState: InitialState = {
  friends: [],
  friendRequests: [],
  friendRequestStatus: 0,
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

export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async (receiverId: number) => {
    try {
      await axios.post(`http://localhost:4000/api/friends/sendFriendRequest`, {
        receiverId,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

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

export const checkFriendRequestStatus = createAsyncThunk(
  "friend/checkFriendRequestStatus",
  async (personB: number) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/friends/checkFriendRequestStatus`,
        { personB }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friend/acceptFriendRequest",
  async (id: number) => {
    try {
      await axios.put(`http://localhost:4000/api/friends/acceptFriendRequest`, {
        id,
      });
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
    builder.addCase(
      checkFriendRequestStatus.fulfilled,
      (state, action: PayloadAction<{ status: number }>) => {
        state.friendRequestStatus = action.payload.status;

        console.log("status", state.friendRequestStatus);
      }
    );
  },
});
export const {} = friendSlice.actions;

export default friendSlice.reducer;
