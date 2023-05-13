import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between shadow-xl py-2 px-2">
      <GiHamburgerMenu size={25} />
    </div>
  );
};

export default Navbar;
