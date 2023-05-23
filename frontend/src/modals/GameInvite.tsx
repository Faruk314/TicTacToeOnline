import React from "react";
import { setGameInviteModal } from "../redux/GameSlice";
import { useAppDispatch } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

const GameInvite = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-10 py-10 space-y-2 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center space-y-2">
          <img
            className="w-[5rem] h-[5rem] border-4 border-black rounded-full"
            alt=""
          />

          <div className="px-5 font-bold text-center text-white bg-black rounded-lg">
            <p>Faruk</p>
          </div>

          <p>wants to play against you!</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              dispatch(playClickSound("/sounds/click.wav"));
              dispatch(setGameInviteModal(false));
            }}
            className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              dispatch(playClickSound("/sounds/click.wav"));
              dispatch(setGameInviteModal(false));
            }}
            className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInvite;
