import express, { Router, Request, Response } from "express";
import { login, register } from "../controllers/auth";

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", login);

export default router;
