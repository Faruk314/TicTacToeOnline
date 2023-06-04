import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { setDifficulty } from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

interface Props {
  setOpenDifficulty: React.Dispatch<React.SetStateAction<boolean>>;
}

const Difficulty = ({ setOpenDifficulty }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const difficulty = useAppSelector((state) => state.game.difficulty);

  useEffect(() => {
    dispatch(setDifficulty("easy"));
  }, [dispatch]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-10 py-5 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            setOpenDifficulty(false);
          }}
          className="absolute top-[-0.5rem] px-2 font-bold border-2 border-black rounded-full right-[-0.5rem] bg-white hover:bg-gray-200"
        >
          X
        </button>

        <h3 className="text-2xl font-bold">Choose difficulty</h3>

        <div>
          <div className="flex items-center space-x-2 text-2xl">
            <input
              onChange={(e) => dispatch(setDifficulty(e.target.value))}
              className="w-4 h-4 border-2 border-black rounded-full appearance-none cursor-pointer checked:bg-black"
              type="radio"
              id="easy"
              name="difficulty"
              value="easy"
              checked={difficulty === "easy"}
            />
            <label htmlFor="easy">Easy</label>
          </div>

          <div className="flex items-center space-x-2 text-2xl">
            <input
              onChange={(e) => dispatch(setDifficulty(e.target.value))}
              className="w-4 h-4 border-2 border-black rounded-full appearance-none cursor-pointer checked:bg-black"
              type="radio"
              id="hard"
              name="difficulty"
              value="hard"
            />
            <label htmlFor="hard">Hard</label>
          </div>
        </div>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            navigate("/vsComputer");
          }}
          className="px-2 py-1 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200 disabled:"
        >
          Start game
        </button>
      </div>
    </div>
  );
};

export default Difficulty;
