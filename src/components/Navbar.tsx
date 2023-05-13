import React from "react";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="flex justify-end p-4">
      <button className="">
        <IoMdSettings size={25} />
      </button>
    </div>
  );
};

export default Navbar;
