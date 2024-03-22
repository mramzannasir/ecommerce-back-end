import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { registerUserRequestBody } from "../types/types.js";

export const registerUser = async (
  req: Request<{}, {}, registerUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Failed to register user. Please try again later.",
    });
  }
};
