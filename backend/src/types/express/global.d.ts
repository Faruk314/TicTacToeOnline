import { Request } from "express";
import { User } from "../custom";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
