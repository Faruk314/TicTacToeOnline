import React from "react";
import MuteButton from "../components/MuteButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playClickSound, toggleMute } from "../redux/SoundSlice";
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: any;
}

const Settings = ({ setOpen, socket }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const otherPlayerId = useAppSelector(
    (state) => state.game.otherPlayerInfo
  )?.userId;

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative shadow-xl py-10 w-[18rem] rounded-md z-30 bg-white">
        <div
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            dispatch(toggleMute());
          }}
          className="flex justify-center py-2 space-x-3 text-xl font-bold cursor-pointer hover:bg-gray-100"
        >
          <span className="">MUTE SOUND</span>
          <MuteButton />
        </div>

        <div
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            socket.emit("leaveGame", otherPlayerId);
            navigate("/menu");
          }}
          className="flex items-center justify-center py-2 space-x-3 text-xl font-bold cursor-pointer hover:bg-gray-100"
        >
          <span>LEAVE GAME</span>
          <IoExitOutline size={25} />
        </div>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            setOpen(false);
          }}
          className="absolute top-[-0.5rem] px-2 font-bold border-2 border-black rounded-full right-[-0.5rem] bg-white hover:bg-gray-200"
        >
          X
        </button>
      </div>
    </section>
  );
};

export default Settings;
