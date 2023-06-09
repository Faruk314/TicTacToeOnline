import React, { useContext, useEffect, useState } from "react";
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
import {
  closeInvitePendingModal,
  openGameInviteModal,
  openInvitePendingModal,
  saveGameRoom,
  setOpenPlayerOffline,
} from "../redux/GameSlice";
import Leaderboard from "../modals/Leaderboard";
import Difficulty from "../modals/Difficulty";
import { SocketContext } from "../context/socket";

const MainMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openMultiplayer, setOpenMultiplayer] = useState(false);
  const [openFriendRequests, setOpenFriendRequests] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const { socket } = useContext(SocketContext);
  const friendRequestsCount = useAppSelector(
    (state) => state.friend.friendRequests
  ).length;

  const handleLogout = async () => {
    dispatch(playClickSound("/sounds/popUp.mp3"));
    await dispatch(logout());
    navigate("/");
  };

  const handleOfflinePlayer = () => {
    dispatch(setOpenPlayerOffline(true));
  };

  useEffect(() => {
    socket?.on("playerOffline", handleOfflinePlayer);

    return () => {
      socket?.off("playerOffline", handleOfflinePlayer);
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("inviteCanceled", () => {
      console.log("hehehe");
      dispatch(openInvitePendingModal(false));
      dispatch(openGameInviteModal(false));
    });

    return () => {
      socket?.off("inviteCanceled");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.emit("cancelInvite");
  }, [socket]);

  // gameStart
  useEffect(() => {
    socket?.on("gameStart", (gameRoomId: string) => {
      dispatch(openGameInviteModal(false));
      dispatch(closeInvitePendingModal());
      dispatch(saveGameRoom(gameRoomId));
      navigate(`/room/${gameRoomId}`);
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate, dispatch]);

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

      {friendRequestsCount > 0 && (
        <span className="absolute text-[0.9rem] top-2 flex justify-center items-center w-[1.2rem] h-[1.2rem] text-white bg-red-500 rounded-full left-9">
          <span>{friendRequestsCount}</span>
        </span>
      )}

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
          <span
            className="flex items-center justify-center py-2 space-x-2 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              dispatch(playClickSound("/sounds/click.wav"));
              setOpenDifficulty(true);
            }}
          >
            <span className="text-xl font-bold"> PLAY VS</span>
            <RiComputerLine size={20} />
          </span>

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
            onClick={() => {
              dispatch(playClickSound("/sounds/click.wav"));
              setOpenLeaderboard(true);
            }}
            className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
          >
            LEADERBOARD
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

      {openMultiplayer && <Multiplayer setOpen={setOpenMultiplayer} />}
      {openFriendRequests && <FriendRequests />}
      {openLeaderboard && (
        <Leaderboard setOpenLeaderboard={setOpenLeaderboard} />
      )}
      {openDifficulty && <Difficulty setOpenDifficulty={setOpenDifficulty} />}
    </section>
  );
};

export default MainMenu;
