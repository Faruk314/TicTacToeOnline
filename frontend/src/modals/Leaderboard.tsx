import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

interface tablePlayer {
  userId: number;
  userName: string;
  score: number;
}

interface Props {
  setOpenLeaderboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const Leaderboard = ({ setOpenLeaderboard }: Props) => {
  const dispatch = useAppDispatch();
  const [leaderboard, setLeaderboard] = useState<tablePlayer[]>([]);

  useEffect(() => {
    const getleaderBoard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/game/getLeaderboard"
        );

        setLeaderboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getleaderBoard();
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center py-5 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            setOpenLeaderboard(false);
          }}
          className="absolute top-[-0.5rem] px-2 font-bold border-2 border-black rounded-full right-[-0.5rem] bg-white hover:bg-gray-200"
        >
          X
        </button>

        <div className="px-4">
          <div className="flex">
            <div className="border border-black w-[5rem]">
              <span className="text-xl ">Rank</span>
            </div>
            <div className="border border-r-0 border-l-0 border-black w-[5rem]">
              <span className="text-xl">Name</span>
            </div>
            <div className="border border-black w-[5rem]">
              <span className="text-xl">Score</span>
            </div>
          </div>
          {leaderboard.map((row, index) => (
            <div key={row.userId} className="flex">
              <div className="border border-t-0 border-black w-[5rem]">
                <span className="text-xl">{index + 1}.</span>
              </div>
              <div className="border-b border-black w-[5rem]">
                <span className="text-xl">{row.userName}</span>
              </div>
              <div className="border border-t-0 border-black w-[5rem]">
                <span className="text-xl">{row.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
