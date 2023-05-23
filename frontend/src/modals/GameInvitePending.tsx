import React from "react";
import { closeInvitePendingModal } from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

const GameInvitePending = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.game.invitePendingMessage);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-5 py-2 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <p>{message}</p>

        <div className="loader"></div>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            dispatch(closeInvitePendingModal());
          }}
          className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GameInvitePending;
