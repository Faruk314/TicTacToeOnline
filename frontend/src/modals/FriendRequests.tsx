import React, { useEffect } from "react";
import InvitePlayer from "../cards/InvitePlayer";
import { getFriendRequests } from "../redux/FriendSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface Props {
  socket: any;
}

const FriendRequests = ({ socket }: Props) => {
  const friendRequests = useAppSelector((state) => state.friend.friendRequests);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFriendRequests());
  }, [dispatch]);

  return (
    <div className="absolute shadow-[0_3px_10px_rgb(0,0,0,0.2)] top-10 left-2 py-10 w-[19rem] px-2 rounded-md z-30 bg-white border-md">
      {friendRequests.length === 0 && (
        <p className="font-bold">You dont have any requests</p>
      )}
      <div className="flex flex-col space-y-2 overflow-y-auto min-h-[5rem] max-h-[15rem] p-2">
        {friendRequests.map((req) => (
          <InvitePlayer socket={socket} key={req.id} friendRequestInfo={req} />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
