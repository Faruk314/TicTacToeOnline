import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import Settings from "../modals/Settings";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end p-4">
      <button onClick={() => setOpen(true)} className="">
        <IoMdSettings size={25} />
      </button>

      {open && <Settings setOpen={setOpen} />}
    </div>
  );
};

export default Navbar;
