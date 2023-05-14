import React from "react";
import { RiComputerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <section className="flex flex-col items-center text-center justify-center h-[100vh]">
      <img src="/images/logo.jpg" alt="" className="w-[9rem] mb-5" />

      <div className="shadow-xl py-10 w-[18rem] rounded-md">
        <div className="w-full">
          <Link
            to="/room"
            className="flex items-center justify-center py-2 space-x-2 hover:bg-gray-100"
          >
            <span className="text-xl font-bold"> PLAY VS</span>
            <RiComputerLine size={20} />
          </Link>

          <span className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100">
            MULTIPLAYER
          </span>

          <span className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100">
            SCOREBOARD
          </span>

          <span className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100">
            LOGOUT
          </span>
        </div>
      </div>
    </section>
  );
};

export default MainMenu;
