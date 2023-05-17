import React from "react";
import FriendRequests from "../modals/FriendRequests";
import { sendFriendRequest } from "../redux/FriendSlice";
import { useAppDispatch } from "../redux/hooks";
import { UserRequest } from "../types/types";
import { User } from "../types/types";

interface Props {
  friendRequestInfo: UserRequest | User;
}

const InvitePlayer = ({ friendRequestInfo }: Props) => {
  const dispatch = useAppDispatch();

  const friendRequestHandler = () => {
    dispatch(sendFriendRequest(friendRequestInfo.userId));
  };

  return (
    <div className="flex items-center justify-between p-2 shadow-md">
      <div className="flex space-x-2">
        <img
          src="/images/logo.jpg"
          alt=""
          className="w-[3rem] h-[3rem] border rounded-lg"
        />

        <div className="flex flex-col items-start">
          <span className="">{friendRequestInfo.userName}</span>
          <span className="">id: {friendRequestInfo.userId}</span>
        </div>
      </div>

      <div className="flex font-bold">
        <button
          onClick={friendRequestHandler}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          ADD
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100">INVITE</button>
      </div>
    </div>
  );
};

export default InvitePlayer;
