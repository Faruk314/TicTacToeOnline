import { createSlice } from "@reduxjs/toolkit";

interface InitialState {}

const initialState: InitialState = {};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
});
export const {} = friendSlice.actions;

export default friendSlice.reducer;
