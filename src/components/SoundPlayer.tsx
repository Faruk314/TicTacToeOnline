import React from "react";
import { useAppSelector } from "../redux/hooks";

const SoundPlayer = () => {
  const isMuted = useAppSelector((state) => state.sound.isMuted);

  return (
    <div>
      {!isMuted && (
        <audio src="/sounds/main.wav" loop={true} autoPlay={!isMuted} />
      )}
    </div>
  );
};

export default SoundPlayer;
