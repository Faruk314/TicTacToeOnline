import React from "react";

const InvitePlayer = () => {
  return (
    <div className="flex items-center justify-between p-2 shadow-md">
      <div className="flex space-x-2">
        <img
          src="/images/logo.jpg"
          alt=""
          className="w-[3rem] h-[3rem] border rounded-lg"
        />

        <div className="flex flex-col items-start">
          <span className="">Faruk</span>
          <span className="">id: 1</span>
        </div>
      </div>

      <div className="flex font-bold">
        <button className="p-2 rounded-md hover:bg-gray-100">ADD</button>
        <button className="p-2 rounded-md hover:bg-gray-100">INVITE</button>
      </div>
    </div>
  );
};

export default InvitePlayer;
