import express, { Router, Request, Response } from "express";
import { findUsers } from "../controllers/user";
import { protect } from "../utils/protect";

const router: Router = express.Router();

router.get("/findUsers", protect, findUsers);

export default router;
