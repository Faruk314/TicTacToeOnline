import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import Settings from "../modals/Settings";
import { useAppDispatch } from "../redux/hooks";
import { playPopUpSound } from "../redux/SoundSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-end p-4">
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
