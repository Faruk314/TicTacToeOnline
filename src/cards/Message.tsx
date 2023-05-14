import React from "react";

interface Props {
  message: string;
}

const Message = ({ message }: Props) => {
  return (
    <div className="p-2">
      <div className="flex space-x-1">
        <span className="font-bold">Faruk:</span>
        <p className="break-all">{message}</p>
      </div>
    </div>
  );
};

export default Message;
