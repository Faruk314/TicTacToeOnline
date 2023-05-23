import React, { useEffect, useState } from "react";
import { RiComputerLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import MuteButton from "../components/MuteButton";
import SoundPlayer from "../components/SoundPlayer";
import Multiplayer from "../modals/Multiplayer";
import { logout } from "../redux/AuthSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  playClickSound,
  playPopUpSound,
  toggleMute,
} from "../redux/SoundSlice";
import { FaUserFriends } from "react-icons/fa";
import FriendRequests from "../modals/FriendRequests";

interface Props {
  socket: any;
}

const MainMenu = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [openMultiplayer, setOpenMultiplayer] = useState(false);
  const [openFriendRequests, setOpenFriendRequests] = useState(false);

  const handleLogout = async () => {
    dispatch(playClickSound("/sounds/popUp.mp3"));
    await dispatch(logout());
    navigate("/");
  };

  // gameStart
  useEffect(() => {
    socket?.on("gameStart", (gameRoomId: number) => {
      navigate(`/room/${gameRoomId}`);
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  return (
    <section className="flex flex-col items-center text-center justify-center h-[100vh]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenFriendRequests((prev) => !prev);
          dispatch(playPopUpSound("/sounds/popUp.mp3"));
        }}
        className="absolute top-3 left-3"
      >
        <FaUserFriends size={25} />
      </button>

      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleMute());
        }}
        className="absolute top-3 right-2"
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
            onClick={() => {
              dispatch(playPopUpSound("/sounds/click.wav"));
              setOpenMultiplayer(true);
            }}
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

      {openMultiplayer && (
        <Multiplayer setOpen={setOpenMultiplayer} socket={socket} />
      )}
      {openFriendRequests && <FriendRequests socket={socket} />}
    </section>
  );
};

export default MainMenu;
