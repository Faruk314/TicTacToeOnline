import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/types";

interface LoginPayload {
  token: string;
  userInfo: User;
}

interface InitialState {
  loggedUserInfo: User | null;
  errorMessage: string;
  isLoggedIn: boolean;
}

const initialState: InitialState = {
  loggedUserInfo: null,
  errorMessage: "",
  isLoggedIn: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    formData: { email: String; password: String },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/auth/login`,
        formData
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    formData: { userName: String; email: String; password: String },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/auth/register`,
        formData
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    cleanMessage(state) {
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<LoginPayload>) => {
        state.loggedUserInfo = action.payload.userInfo;
        state.isLoggedIn = true;
      }
    );

    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      const payload = action.payload;

      if (typeof payload === "string") {
        state.errorMessage = action.payload;
      }
    });

    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<LoginPayload>) => {
        state.loggedUserInfo = action.payload.userInfo;
        state.isLoggedIn = true;
      }
    );

    builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
      const payload = action.payload;

      if (typeof payload === "string") {
        state.errorMessage = action.payload;
      }
    });
  },
});

export const { cleanMessage } = authSlice.actions;

export default authSlice.reducer;
