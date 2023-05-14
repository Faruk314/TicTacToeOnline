import React from "react";
import Player from "../cards/Player";
import Board from "../components/Board";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import SoundPlayer from "../components/SoundPlayer";

const GameRoom = () => {
  return (
    <section className="relative">
      <Navbar />

      <div className="flex justify-between px-4 py-10">
        <Player />

        <span className="self-center text-2xl font-bold">VS</span>

        <Player />
      </div>

      <Board />

      <Chat />

      <SoundPlayer />
    </section>
  );
};

export default GameRoom;
