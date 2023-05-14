import React from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Settings = ({ setOpen }: Props) => {
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative shadow-xl py-10 w-[18rem] rounded-md z-30 bg-white">
        <div className="flex items-center justify-center py-2 space-x-2 text-xl font-bold cursor-pointer hover:bg-gray-100">
          <span>MUTE SOUND</span>
          <ImVolumeMute />
        </div>

        <span className="block py-2 text-xl font-bold cursor-pointer hover:bg-gray-100">
          LEAVE GAME
        </span>

        <button
          onClick={() => setOpen(false)}
          className="absolute top-[-0.5rem] px-2 font-bold border-2 border-black rounded-full right-[-0.5rem] bg-white hover:bg-gray-200"
        >
          X
        </button>
      </div>
    </section>
  );
};

export default Settings;
