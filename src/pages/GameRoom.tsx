import React from "react";
import Player from "../cards/Player";
import Board from "../components/Board";
import Navbar from "../components/Navbar";

const GameRoom = () => {
  return (
    <section>
      <Navbar />

      <div className="flex justify-between px-4 py-10">
        <Player />

        <span className="self-center text-2xl font-bold">VS</span>

        <Player />
      </div>

      <Board />
    </section>
  );
};

export default GameRoom;
