import React from "react";
import Message from "../cards/Message";

const Chat = () => {
  return (
    <div className="flex flex-col fixed border-2 border-black bottom-0 right-0 h-[20rem] w-full md:w-[20rem]">
      <div className="h-full overflow-y-auto bg-gray-50">
        <Message message={"hello"} />
      </div>

      <div className="flex space-x-1 items-center h-[3rem] p-1">
        <textarea
          className="w-full h-full px-2 border-2 border-black outline-none"
          placeholder="Enter your message here"
          rows={2}
        />

        <button className="bg-black h-full w-[5rem] text-white hover:bg-white border hover:border-black hover:text-black">
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
