import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import Settings from "../modals/Settings";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playPopUpSound } from "../redux/SoundSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const totalRounds = useAppSelector((state) => state.game.totalRounds);

  return (
    <div className="flex justify-between p-4">
      <h2 className="text-xl font-bold">
        <span>Rounds: </span>
        <span>{totalRounds}</span>
      </h2>

      <button
        onClick={() => {
          dispatch(playPopUpSound("/sounds/popUp.mp3"));
          setOpen(true);
        }}
        className=""
      >
        <IoMdSettings size={25} />
      </button>

      {open && <Settings setOpen={setOpen} />}
    </div>
  );
};

export default Navbar;
