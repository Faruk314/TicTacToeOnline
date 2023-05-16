import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser: number | undefined = req.user?.userId;
    const personB: number = req.body.receiverId;

    //Check if request exists
    let q = `SELECT fr.id FROM friend_requests fr WHERE (fr.sender=? OR fr.receiver=?) AND (fr.sender=? OR fr.receiver= ?) AND (fr.status=? OR fr.status=?)`;
    let result: any = await query(q, [
      loggedUser,
      loggedUser,
      personB,
      personB,
      "pending",
      "accepted",
    ]);

    if (result) {
      res.status(400);
      throw new Error("Friend request already exists");
    }

    q =
      "INSERT INTO friend_requests (sender, receiver, status) VALUES (?, ?, ?)";

    result = await query(q, [loggedUser, personB, "pending"]);

    if (result.affectedRows === 1) {
      res.status(200).json("Friend request sent");
    } else {
      res.status(400);
      throw new Error("Failed to send friend request");
    }
  }
);

export const checkFriendRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser: number | undefined = req.user?.userId;
    const personB: number = req.body.personB;

    let q = `SELECT fr.status FROM friend_requests fr WHERE (fr.sender=? OR fr.receiver=?) AND (fr.sender=? OR fr.receiver= ?) AND (fr.status=? OR fr.status=?)`;
    let result: any = await query(q, [
      loggedUser,
      loggedUser,
      personB,
      personB,
      "pending",
      "accepted",
    ]);

    if (!result) {
      //zero indicates that friend request is not sent
      res.json({ status: 0 });
    }

    if (result && result[0].status === "pending") {
      //1 indicates that friend request is sent
      res.json({ status: 1 });
    }

    if (result && result[0].status === "accepted") {
      //2 indicates that logged user and person B are already friends
      res.json({ status: 2 });
    }
  }
);
