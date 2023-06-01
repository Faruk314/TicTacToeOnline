import express, { Router, Request, Response } from "express";
import { getLeaderboard, updateLeaderboard } from "../controllers/game";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.get("/getLeaderboard", getLeaderboard);

router.post("/updateLeaderboard", protect, updateLeaderboard);

export default router;
