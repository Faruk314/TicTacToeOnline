import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types/types";

interface LoginPayload {
  token: string;
  userInfo?: User;
  status: boolean;
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

export const getLoginStatus = createAsyncThunk(
  "auth/getLoginStatus",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/auth/getLoginStatus`
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.get(`http://localhost:4000/api/auth/logout`);
  } catch (error) {
    console.log(error);
  }
});

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
        const loggedUserInfo = action.payload.userInfo;

        if (loggedUserInfo) {
          state.loggedUserInfo = loggedUserInfo;
        }

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
        const loggedUserInfo = action.payload.userInfo;

        if (loggedUserInfo) {
          state.loggedUserInfo = loggedUserInfo;
        }

        state.isLoggedIn = true;
      }
    );

    builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
      const payload = action.payload;

      if (typeof payload === "string") {
        state.errorMessage = action.payload;
      }
    });

    builder.addCase(
      getLoginStatus.fulfilled,
      (state, action: PayloadAction<LoginPayload>) => {
        const loggedUserInfo = action.payload.userInfo;
        const loginStatus = action.payload.status;

        if (loggedUserInfo) {
          state.loggedUserInfo = loggedUserInfo;
        }

        state.isLoggedIn = loginStatus;

        console.log(loggedUserInfo);
        console.log(loginStatus);
      }
    );

    builder.addCase(logout.fulfilled, (state) => {
      state.isLoggedIn = false;

      console.log(state.isLoggedIn);
    });
  },
});

export const { cleanMessage } = authSlice.actions;

export default authSlice.reducer;
