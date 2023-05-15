import express, { Router, Request, Response } from "express";
import { findUsers } from "../controllers/user";

const router: Router = express.Router();

router.get("/findUsers", findUsers);

export default router;
