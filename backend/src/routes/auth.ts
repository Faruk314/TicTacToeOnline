import express, { Router, Request, Response } from "express";
import { register } from "../controllers/auth";

const router: Router = express.Router();

router.get("/register", register);

export default router;
