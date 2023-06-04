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
import { User, UserRequest } from "./types/types";
import { deleteFriend, updateFriendRequests } from "./redux/FriendSlice";
import GameInvite from "./modals/GameInvite";
import {
  openGameInviteModal,
  openInvitePendingModal,
  setOtherPlayerInfo,
} from "./redux/GameSlice";
import VsComputer from "./pages/VsComputer";
import PlayerOffline from "./modals/PlayerOffline";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();
  const gameInviteOpen = useAppSelector((state) => state.game.gameInviteOpen);
  const socket = useSocket();
  const gameRoomId = useAppSelector((state) => state.game.roomId);
  const playerOffline = useAppSelector((state) => state.game.openPlayerOffline);

  useEffect(() => {
    socket?.on("connect", () => {
      if (gameRoomId) {
        socket.emit("reconnectToRoom", gameRoomId);
      }
    });
  }, [socket, gameRoomId]);

  useEffect(() => {
    socket?.on("getFriendRequest", (request: UserRequest) => {
      dispatch(updateFriendRequests(request));
    });

    return () => {
      socket?.off("getFriendRequest");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket?.on("deletedFromFriends", (requestId: number) => {
      dispatch(deleteFriend(requestId));
    });

    return () => {
      socket?.off("deletedFromFriends");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket?.on("gameInvite", (data: User) => {
      dispatch(openGameInviteModal(true));
      dispatch(setOtherPlayerInfo(data));
    });

    return () => {
      socket?.off("gameInvite");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    socket?.on("gameInvitePending", () => {
      dispatch(openInvitePendingModal(true));
    });

    return () => {
      socket?.off("gameInvitePending");
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
        <Route path="/room/:id" element={<GameRoom socket={socket} />} />
        <Route path="/vsComputer" element={<VsComputer />} />
      </Routes>
      {gameInviteOpen && <GameInvite socket={socket} />}
      {playerOffline && <PlayerOffline />}
    </BrowserRouter>
  );
}

export default App;
