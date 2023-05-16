import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import query from "../db";
import { User } from "../types/custom";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(400);
      throw new Error("Token does not exist");
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!verified) {
      res.status(400);
      throw new Error("Token not verified");
    }

    if (!verified.userId) {
      res.status(400);
      throw new Error("UserId does not exist on JWT token");
    }

    try {
      let q =
        "SELECT `user_id` AS userId ,`user_name` AS userName,`email` FROM users WHERE `user_id`= ?";

      let data: any = await query(q, [verified.userId]);

      let userInfo: User = data[0];

      req.user = userInfo;

      next();
    } catch (error) {
      console.log("Error retrieving loggedUserInfo", error);
    }
  }
);
