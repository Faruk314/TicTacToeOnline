import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameRoom from "./pages/GameRoom";
import Login from "./pages/Login";
import MainMenu from "./pages/MainMenu";
import Register from "./pages/Register";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getLoginStatus } from "./redux/AuthSlice";
import { useSocket } from "./hooks/useSocket";
import { UserRequest } from "./types/types";
import { updateFriendRequests } from "./redux/FriendSlice";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();

  const socket = useSocket();

  useEffect(() => {
    socket?.on("getFriendRequest", (request: UserRequest) => {
      dispatch(updateFriendRequests(request));
    });

    return () => {
      socket?.off("getFriendRequest");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<MainMenu socket={socket} />} />
        <Route path="/room/:id" element={<GameRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
