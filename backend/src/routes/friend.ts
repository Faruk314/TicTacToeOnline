import express, { Router } from "express";
import { sendFriendRequest } from "../controllers/friend";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.post("/sendFriendRequest", protect, sendFriendRequest);

export default router;
