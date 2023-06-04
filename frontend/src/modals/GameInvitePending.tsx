import React, { useContext } from "react";
import { SocketContext } from "../context/socket";
import { closeInvitePendingModal } from "../redux/GameSlice";
import { useAppDispatch } from "../redux/hooks";
import { playClickSound } from "../redux/SoundSlice";

interface Props {
  invitedUserId: number;
}

const GameInvitePending = ({ invitedUserId }: Props) => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);

  console.log("inviteUserid", invitedUserId);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-5 py-2 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <p>Waiting for player to accept invitation</p>

        <div className="loader"></div>

        <button
          onClick={() => {
            dispatch(playClickSound("/sounds/click.wav"));
            socket?.emit("cancelInvite");
            dispatch(closeInvitePendingModal());
          }}
          className="px-2 font-bold bg-white border-2 border-black rounded-full hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GameInvitePending;
