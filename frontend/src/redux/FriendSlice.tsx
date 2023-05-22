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

export const acceptFriendRequest = createAsyncThunk(
  "friend/acceptFriendRequest",
  async (id: number) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/friends/acceptFriendRequest`,
        {
          id,
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteFriendRequest = createAsyncThunk(
  "friend/deleteFriendRequest",
  async (id: number) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/friends/deleteFriendRequest`,
        {
          id,
        }
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
  reducers: {
    updateFriendRequests(state, action: PayloadAction<UserRequest>) {
      const friendRequest = action.payload;

      const updatedFriendRequests = [...state.friendRequests, friendRequest];

      state.friendRequests = updatedFriendRequests;
    },
    deleteFriend(state, action) {
      const requestId: number = action.payload;

      const updatedFriends = state.friends.filter(
        (friend) => friend.id !== requestId
      );

      state.friends = updatedFriends;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getFriends.fulfilled,
      (state, action: PayloadAction<UserRequest[]>) => {
        state.friends = action.payload;
      }
    );
    builder.addCase(
      getFriendRequests.fulfilled,
      (state, action: PayloadAction<UserRequest[]>) => {
        state.friendRequests = action.payload;
      }
    );

    builder.addCase(
      acceptFriendRequest.fulfilled,
      (state, action: PayloadAction<{ status: number; id: number }>) => {
        const status: number = action.payload.status;
        const requestId: number = action.payload.id;

        if (status === 2) {
          let friendRequest = state.friendRequests.find(
            (req) => req.id === requestId
          );

          if (friendRequest) {
            let updatedFriendRequests = state.friendRequests.filter(
              (req) => req.id !== requestId
            );
            state.friendRequests = updatedFriendRequests;
            friendRequest.status = "accepted";
            state.friends = [...state.friends, friendRequest];
          }
        }
      }
    );

    builder.addCase(
      deleteFriendRequest.fulfilled,
      (state, action: PayloadAction<{ status: number; id: number }>) => {
        const requestId: number = action.payload.id;
        const status: number = action.payload.status;

        if (status === 0) {
          let updatedFriendRequests = state.friendRequests.filter(
            (req) => req.id !== requestId
          );
          state.friendRequests = updatedFriendRequests;

          let updatedFriends = state.friends.filter(
            (req) => req.id !== requestId
          );

          state.friends = updatedFriends;
        }
      }
    );
  },
});
export const { updateFriendRequests, deleteFriend } = friendSlice.actions;

export default friendSlice.reducer;
