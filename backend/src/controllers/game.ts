import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const updateLeaderboard = asyncHandler(
  async (req: Request, res: Response) => {
    const winnerId: number | undefined = req.user?.userId;
    const points = 5;

    if (!winnerId) {
      res.status(400);
      throw new Error("Winner id does not exist");
    }

    try {
      let q =
        "INSERT INTO scoreboard (`user_id`, `score`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `score` = `score` + ?";

      await query(q, [winnerId, points, points]);

      res.status(200).json("Leaderboard updated successfully");
    } catch (err) {
      res.status(500).json("Failed to update leaderboard");
    }
  }
);

export const getLeaderboard = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      let q =
        "SELECT u.user_id AS userId, u.user_name AS userName, sb.score FROM users u JOIN scoreboard sb ON u.user_id=sb.user_id ORDER BY sb.score DESC";

      let data = await query(q, []);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json("There was a problem fetching leaderboard");
    }
  }
);
