import React, { useEffect } from "react";
import Player from "../cards/Player";
import Board from "../components/Board";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import SoundPlayer from "../components/SoundPlayer";
import { Message } from "../types/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { saveMessage } from "../redux/GameSlice";

interface Props {
  socket: any;
}

const GameRoom = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const otherPlayerInfo = useAppSelector((state) => state.game.otherPlayerInfo);

  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => {
      dispatch(saveMessage(message));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, dispatch]);

  return (
    <section className="relative">
      <Navbar />

      <div className="flex justify-between px-4 py-10">
        <Player playerInfo={loggedUserInfo} />

        <span className="self-center text-2xl font-bold">VS</span>

        <Player playerInfo={otherPlayerInfo} />
      </div>

      <Board />

      <Chat socket={socket} />

      <SoundPlayer />
    </section>
  );
};

export default GameRoom;
