import React from "react";
import { useAppSelector } from "../redux/hooks";
import { User } from "../types/types";

interface Props {
  playerInfo: User | null;
}

const Player = ({ playerInfo }: Props) => {
  const stats = useAppSelector((state) => state.game.playersStats);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <img
          className="w-[5rem] h-[5rem] border-4 border-black rounded-full"
          alt=""
        />

        <div className="flex justify-center items-center absolute top-0 left-[-0.3rem   ] bg-black text-white font-bold rounded-full w-6 h-6">
          {playerInfo?.userId === stats?.X.userId ? "X" : "O"}
        </div>
      </div>

      <div className="px-5 font-bold text-center text-white bg-black rounded-lg">
        <p>{playerInfo?.userName}</p>
      </div>

      <p className="text-4xl">
        {stats?.X.userId === playerInfo?.userId
          ? stats?.X.score
          : stats?.O.score}
      </p>
    </div>
  );
};

export default Player;
