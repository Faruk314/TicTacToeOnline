import express, { Router } from "express";
import { sendFriendRequest } from "../controllers/friend";

const router: Router = express.Router();

router.put("/sendFriendRequest", sendFriendRequest);

export default router;
