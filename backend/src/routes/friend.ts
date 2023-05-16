import express, { Router } from "express";
import {
  checkFriendRequestStatus,
  deleteFriendRequest,
  getFriendRequests,
  sendFriendRequest,
} from "../controllers/friend";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.get("/getFriendRequests", protect, getFriendRequests);

router.post("/sendFriendRequest", protect, sendFriendRequest);

router.post("/checkFriendRequestStatus", protect, checkFriendRequestStatus);

router.put("/deleteFriendRequest", protect, deleteFriendRequest);

export default router;
