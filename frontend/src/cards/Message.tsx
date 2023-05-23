import React from "react";

interface Props {
  message: string;
  senderName: string;
}

const Message = ({ message, senderName }: Props) => {
  return (
    <div className="p-2">
      <div className="flex space-x-1">
        <span className="font-bold">{senderName}:</span>
        <p className="break-all">{message}</p>
      </div>
    </div>
  );
};

export default Message;
