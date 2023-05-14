import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler";

dotenv.config();

const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

//routes
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
