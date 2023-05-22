import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const findUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  const loggedUser = req.user?.userId;

  const searchTerm = `%${search}%`;

  let q =
    "SELECT `user_id` AS userId, `user_name` AS userName, `image` FROM users WHERE (`user_name` LIKE ? OR `user_id` LIKE ?) AND `user_id` <> ?";

  let data = await query(q, [searchTerm, searchTerm, loggedUser]);

  res.status(200).json(data);
});
