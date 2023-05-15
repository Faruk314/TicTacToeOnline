import React, { useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";
import InvitePlayer from "../cards/InvitePlayer";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Multiplayer = ({ setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const [openInvite, setOpenInvite] = useState(false);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative shadow-xl py-10 w-[18rem] rounded-md z-30 bg-white">
        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            setOpen(false);
          }}
          className="absolute top-[-0.5rem] px-2 font-bold border-2 border-black rounded-full right-[-0.5rem] bg-white hover:bg-gray-200"
        >
          X
        </button>

        <span
          onClick={() => dispatch(playClickSound("/sounds/click.wav"))}
          className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
        >
          FIND MATCH
        </span>

        <span
          onClick={() => {
            setOpenInvite((prev) => !prev);
            dispatch(playClickSound("/sounds/click.wav"));
          }}
          className="block py-2 mt-2 text-xl font-bold cursor-pointer hover:bg-gray-100"
        >
          SEND INVITE
        </span>

        {openInvite && (
          <div className="px-2 mt-2">
            <input
              className="p-2 border-2 border-black rounded-md"
              placeholder="Search by name or id"
            />

            <div className="flex flex-col mt-2 px-1 py-2 space-y-2 overflow-y-auto max-h-[12rem]">
              <InvitePlayer />
              <InvitePlayer />
              <InvitePlayer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Multiplayer;
