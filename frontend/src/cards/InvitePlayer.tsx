import React, { useEffect, useState } from "react";
import FriendRequests from "../modals/FriendRequests";
import {
  acceptFriendRequest,
  checkFriendRequestStatus,
  sendFriendRequest,
} from "../redux/FriendSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserRequest } from "../types/types";

interface Props {
  friendRequestInfo: UserRequest;
}

const InvitePlayer = ({ friendRequestInfo }: Props) => {
  const dispatch = useAppDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const friendRequestStatus = useAppSelector(
    (state) => state.friend.friendRequestStatus
  );

  console.log(friendRequestInfo.userName, friendRequestStatus);

  const friendRequestHandler = () => {
    dispatch(sendFriendRequest(friendRequestInfo.userId));
    dispatch(checkFriendRequestStatus(friendRequestInfo.userId));
  };

  useEffect(() => {
    dispatch(checkFriendRequestStatus(friendRequestInfo.userId));
  }, [dispatch]);

  return (
    <div className="flex items-center justify-between p-2 shadow-md">
      <div
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex space-x-2"
      >
        <img
          src="/images/logo.jpg"
          alt=""
          className="w-[3rem] h-[3rem] border rounded-lg relative"
        />

        {isHovering && (
          <div className="absolute left-[4rem] z-10 flex flex-col items-start bg-[rgb(0,0,0,0.7)] text-white px-4 rounded-md">
            <span className="">{friendRequestInfo.userName}</span>
            <span className="">id: {friendRequestInfo.userId}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col font-bold">
        {friendRequestStatus === 0 && (
          <div>
            <button
              onClick={friendRequestHandler}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              ADD
            </button>

            <button className="p-2 rounded-md hover:bg-gray-100">INVITE</button>
          </div>
        )}

        {friendRequestStatus === 1 &&
          loggedUserInfo?.userId !== friendRequestInfo.userId && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (friendRequestInfo.id) {
                    dispatch(acceptFriendRequest(friendRequestInfo.id));
                    dispatch(
                      checkFriendRequestStatus(friendRequestInfo.userId)
                    );
                  }
                }}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ACCEPT
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                REJECT
              </button>
            </div>
          )}

        {friendRequestStatus === 1 &&
          loggedUserInfo?.userId === friendRequestInfo.userId && (
            <div className="flex space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100">SENT</button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                INVITE
              </button>
            </div>
          )}

        {friendRequestStatus === 2 && !friendRequestInfo.id && (
          <div>
            <button className="p-2 rounded-md hover:bg-gray-100">
              UNFRIEND
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100">INVITE</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePlayer;
