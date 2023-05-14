import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q = "SELECT `id` FROM users WHERE `email`= ?";

  let result = await query(q, [email]);

  if (result) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password has to be 6 characters min");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    q = "INSERT INTO users (`user_name`,`email`,`password`) VALUES (?, ?, ?)";

    result = await query(q, [userName, email, hash]);

    res.status(200).json("User successfully registered");
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred during user registration");
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q = "SELECT `user_id`,`password` FROM users WHERE `email` = ?";

  let data: any = await query(q, [email]);

  if (!data) {
    res.status(404);
    throw new Error("Incorrect email or password");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Incorrect email or password");
  }

  const token = jwt.sign({ id: data[0].user_id }, process.env.JWT_SECRET!);

  if (!token) {
    res.status(400);
    throw new Error("Something went wrong with token creation");
  }

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json(token);
});