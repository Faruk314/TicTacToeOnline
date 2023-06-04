import React, { useContext, useEffect } from "react";
import { SocketContext } from "../context/socket";
import { useAppDispatch } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);

  const matchFoundHandler = ({
    senderId,
    receiverId,
  }: {
    senderId: number;
    receiverId: number;
  }) => {
    socket?.emit("acceptInvite", { senderId, receiverId });
  };

  useEffect(() => {
    socket?.on("matchFound", matchFoundHandler);

    return () => {
      socket?.off("matchFound", matchFoundHandler);
    };
  }, [socket]);

  useEffect(() => {
    socket?.emit("findMatch");
  }, [socket]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-20 pt-20 pb-10 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <p className="text-xl">Looking for match</p>

        <div className="loader"></div>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            socket?.emit("cancelFindMatch");
            setOpenFindMatch(false);
          }}
          className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FindMatch;
