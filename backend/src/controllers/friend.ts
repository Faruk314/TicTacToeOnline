import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    res.json("123");
  }
);
