import express, { Router } from "express";
import {
  checkFriendRequestStatus,
  sendFriendRequest,
} from "../controllers/friend";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.post("/sendFriendRequest", protect, sendFriendRequest);

router.post("/checkFriendRequestStatus", protect, checkFriendRequestStatus);

export default router;
