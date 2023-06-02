import React from "react";
import { useNavigate } from "react-router";
import { setGameLeaveOpen, updateLeaderboard } from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

const OpponentLeft = () => {
  const dispatch = useAppDispatch();
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-20 py-5 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <p className="text-2xl font-bold">Opponent left you won!</p>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));

            if (loggedUserInfo) {
              dispatch(updateLeaderboard(loggedUserInfo?.userId));
            }

            dispatch(setGameLeaveOpen(false));
            navigate("/menu");
          }}
          className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OpponentLeft;
