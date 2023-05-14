import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.get("/login", (req: Request, res: Response) => {
  res.send("This is the example route");
});

export default router;
