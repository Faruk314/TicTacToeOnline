import React from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import { useAppSelector } from "../redux/hooks";

const MuteButton = () => {
  const isMuted = useAppSelector((state) => state.sound.isMuted);

  return (
    <div className="">
      {!isMuted && (
        <button>
          <ImVolumeMute size={25} />
        </button>
      )}

      {isMuted && (
        <button>
          <ImVolumeMute2 size={25} />
        </button>
      )}
    </div>
  );
};

export default MuteButton;
