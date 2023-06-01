import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import friendRoute from "./routes/friend";
import gameRoute from "./routes/game";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler";
import cors from "cors";
import setupSocket from "./socket";
import http from "http";

dotenv.config();

const app: Express = express();

const server = http.createServer(app);
setupSocket();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/game", gameRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(errorHandler);
