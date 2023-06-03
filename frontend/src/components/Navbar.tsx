import React, { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import Settings from "../modals/Settings";
import { setGameLeaveOpen } from "../redux/GameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { playPopUpSound } from "../redux/SoundSlice";
import OpponentLeft from "../modals/OpponentLeft";

interface Props {
  socket?: any;
  singlePlayer?: boolean;
}

const Navbar = ({ socket, singlePlayer }: Props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const totalRounds = useAppSelector((state) => state.game.totalRounds);

  const gameLeaveOpen = useAppSelector((state) => state.game.gameLeaveOpen);

  const opponentLeftHandler = () => {
    dispatch(setGameLeaveOpen(true));
  };

  useEffect(() => {
    if (socket) {
      socket?.on("opponentLeft", opponentLeftHandler);
    }

    return () => {
      if (socket) {
        socket.off("opponentLeft", opponentLeftHandler);
      }
    };
  }, [socket]);

  return (
    <div className="flex justify-between p-4">
      {!singlePlayer && (
        <h2 className="text-xl font-bold">
          <span>Rounds: </span>
          <span>{totalRounds}</span>
        </h2>
      )}

      <button
        onClick={() => {
          dispatch(playPopUpSound("/sounds/popUp.mp3"));
          setOpen(true);
        }}
        className=""
      >
        <IoMdSettings size={25} />
      </button>

      {open && (
        <Settings
          socket={socket}
          setOpen={setOpen}
          singlePlayer={singlePlayer}
        />
      )}
      {gameLeaveOpen && <OpponentLeft />}
    </div>
  );
};

export default Navbar;
