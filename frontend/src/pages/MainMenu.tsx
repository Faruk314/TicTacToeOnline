import React, { useEffect } from "react";
import { RiComputerLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import MuteButton from "../components/MuteButton";
import SoundPlayer from "../components/SoundPlayer";
import { logout } from "../redux/AuthSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound, toggleMute } from "../redux/SoundSlice";

const MainMenu = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(playClickSound("/sounds/click.wav"));
    await dispatch(logout());
    navigate("/");
  };

  return (
    <section className="flex flex-col items-center text-center justify-center h-[100vh]">
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleMute());
        }}
        className="absolute top-2 right-2"
      >
        <MuteButton />
      </div>

      <img src="/images/logo.jpg" alt="" className="w-[9rem] mb-5" />

      <div className="shadow-xl py-10 w-[18rem] rounded-md">
        <div className="w-full">
          <Link
            to="/room"
            className="flex items-center justify-center py-2 space-x-2 hover:bg-gray-100"
            onClick={() => dispatch(playClickSound("/sounds/click.wav"))}
          >
            <span className="text-xl font-bold"> PLAY VS</span>
            <RiComputerLine size={20} />
          </Link>

          <span
            onClick={() => dispatch(playClickSound("/sounds/click.wav"))}
            className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
          >
            MULTIPLAYER
          </span>

          <span
            onClick={() => dispatch(playClickSound("/sounds/click.wav"))}
            className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
          >
            SCOREBOARD
          </span>

          <span
            onClick={handleLogout}
            className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
          >
            LOGOUT
          </span>
        </div>
      </div>

      <SoundPlayer />
    </section>
  );
};

export default MainMenu;
