import { NextFunction, Response, Request } from "express";

export interface registerUserRequestBody {
  _id: string;
  name: string;
  email: string;
  password: string;
  photo: string;
  dob: Date;
}
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface NewProductRequestBody {
  name: string;
  photo: string;
  description: string;
  category: string;
  price: string;
  stock: string;
}
