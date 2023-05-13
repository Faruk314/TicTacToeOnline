import React from "react";

const Player = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <img
          className="w-[5rem] h-[5rem] border-4 border-black rounded-full"
          alt=""
        />

        <div className="flex justify-center items-center absolute top-0 left-[-0.3rem   ] bg-black text-white font-bold rounded-full w-6 h-6">
          X
        </div>
      </div>

      <div className="bg-black rounded-lg text-white font-bold text-center px-5">
        <p>Faruk</p>
      </div>

      <p className="text-4xl">1</p>
    </div>
  );
};

export default Player;
