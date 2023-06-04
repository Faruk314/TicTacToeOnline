import React, { useContext, useEffect, useState } from "react";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  sendFriendRequest,
} from "../redux/FriendSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserRequest } from "../types/types";
import axios from "axios";
import { FriendRequestStatus } from "../types/types";
import GameInvitePending from "../modals/GameInvitePending";
import { SocketContext } from "../context/socket";

interface Props {
  friendRequestInfo: UserRequest;
}

const InvitePlayer = ({ friendRequestInfo }: Props) => {
  const dispatch = useAppDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FriendRequestStatus | null>(null);
  const invitePendingModalOpen = useAppSelector(
    (state) => state.game.invitePendingModalOpen
  );
  const { socket } = useContext(SocketContext);

  const friendRequestHandler = async () => {
    await dispatch(sendFriendRequest(friendRequestInfo.userId));
    socket?.emit("sendFriendRequest", {
      senderId: loggedUserInfo?.userId,
      receiverId: friendRequestInfo.userId,
    });
    checkFriendRequestStatus();
  };

  const checkFriendRequestStatus = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/friends/checkFriendRequestStatus`,
        { personB: friendRequestInfo.userId }
      );

      setFriendRequestStatus(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const inviteHandler = () => {
    socket?.emit("sendInvite", {
      senderId: loggedUserInfo?.userId,
      receiverId: friendRequestInfo.userId,
    });
  };

  useEffect(() => {
    checkFriendRequestStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {friendRequestStatus?.status === 0 && (
          <div>
            <button
              onClick={friendRequestHandler}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              ADD
            </button>

            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              INVITE
            </button>
          </div>
        )}

        {friendRequestStatus?.status === 1 &&
          friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (friendRequestInfo.id) {
                    dispatch(acceptFriendRequest(friendRequestInfo.id));
                  }
                }}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ACCEPT
              </button>
              <button
                onClick={() => {
                  if (friendRequestInfo.id) {
                    dispatch(deleteFriendRequest(friendRequestInfo.id));
                  }
                }}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                REJECT
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 1 &&
          !friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <div className="flex space-x-2">
              <span className="p-2 rounded-md">PENDING</span>
              <button
                onClick={() => inviteHandler()}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                INVITE
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 1 &&
          loggedUserInfo?.userId === friendRequestStatus.sender && (
            <div className="flex space-x-2">
              <span className="p-2 rounded-md">SENT</span>
              <button
                onClick={() => inviteHandler()}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                INVITE
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 2 && friendRequestInfo.id && (
          <div>
            <button
              onClick={() => {
                if (friendRequestInfo.id) {
                  dispatch(deleteFriendRequest(friendRequestInfo.id));
                  socket?.emit("deleteFriend", {
                    userId: friendRequestInfo.userId,
                    requestId: friendRequestInfo.id,
                  });
                }
              }}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              UNFRIEND
            </button>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              INVITE
            </button>
          </div>
        )}

        {friendRequestStatus?.status === 2 && !friendRequestInfo.id && (
          <div className="flex items-center space-x-2">
            <span>FRIENDS</span>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              INVITE
            </button>
          </div>
        )}
      </div>
      {invitePendingModalOpen && (
        <GameInvitePending invitedUserId={friendRequestInfo.userId} />
      )}
    </div>
  );
};

export default InvitePlayer;
