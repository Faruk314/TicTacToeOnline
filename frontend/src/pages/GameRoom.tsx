import React, { useContext } from "react";
import Player from "../cards/Player";
import Board from "../components/Board";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import SoundPlayer from "../components/SoundPlayer";
import { useAppSelector } from "../redux/hooks";
import { SocketContext } from "../context/socket";

const GameRoom = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const otherPlayerInfo = useAppSelector((state) => state.game.otherPlayerInfo);
  const playerTurn = useAppSelector((state) => state.game.playerTurn);
  const { socket } = useContext(SocketContext);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative">
      <Navbar />

      <p className="text-2xl font-bold text-center">{playerTurn} turn</p>

      <div className="flex justify-between px-4 py-10">
        <Player playerInfo={loggedUserInfo} />

        <span className="self-center text-2xl font-bold">VS</span>

        <Player playerInfo={otherPlayerInfo} />
      </div>

      <Board />

      <Chat />

      <SoundPlayer />
    </section>
  );
};

export default GameRoom;
