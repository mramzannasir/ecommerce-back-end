import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { registerUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";

export const registerUser = TryCatch(
  async (
    req: Request<{}, {}, registerUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password, photo, _id, dob } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      photo,
      _id,
      dob: new Date(dob),
    });
    res.status(201).json({
      success: true,
      status: 201,
      message: `Welcome, ${user.name}!`,
    });
  }
);
