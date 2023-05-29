import React, { useState, useEffect } from "react";
import Message from "../cards/Message";
import { saveMessage } from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Message as Msg } from "../types/types";

interface Props {
  socket: any;
}

const Chat = ({ socket }: Props) => {
  const dispatch = useAppDispatch();
  const roomId = useAppSelector((state) => state.game.roomId);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [message, setMessage] = useState("");
  const messages = useAppSelector((state) => state.game.messages);

  useEffect(() => {
    socket.on("receiveMessage", (message: Msg) => {
      dispatch(saveMessage(message));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, dispatch]);

  return (
    <div className="flex flex-col fixed border-2 border-black bottom-0 right-0 h-[20rem] w-full md:w-[20rem]">
      <div className="h-full overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <Message
            key={message.id}
            senderName={message.senderName}
            message={message.message}
          />
        ))}
      </div>

      <div className="flex space-x-1 items-center h-[3rem] p-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-full px-2 border-2 border-black outline-none"
          placeholder="Enter your message here"
          rows={2}
        />

        <button
          onClick={(e) => {
            socket.emit("sendMessage", {
              roomId,
              senderName: loggedUserInfo?.userName,
              message,
            });

            setMessage("");
          }}
          className="bg-black h-full w-[5rem] text-white hover:bg-white border hover:border-black hover:text-black"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
