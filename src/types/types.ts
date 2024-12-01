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

export type FilterQueryType = {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
  minStock?: string;
  maxStock?: string;
  minAge?: string;
  maxAge?: string;
  minDob?: string;
  maxDob?: string;
  minRating?: string;
  maxRating?: string;
  minRatingCount?: string;
  maxRatingCount?: string;
  minReviewCount?: string;
  maxReviewCount?: string;
  minReview?: string;
  maxReview?: string;
  minOrderCount?: string;
  maxOrderCount?: string;
  minOrderPrice?: string;
  maxOrderPrice?: string;
  minOrderAmount?: string;
  maxOrderAmount?: string;
  minOrderAmountPaid?: string;
  maxOrderAmountPaid?: string;
  minOrderAmountDue?: string;
  maxOrderAmountDue?: string;
  minOrderDate?: string;
  maxOrderDate?: string;
  minOrderStatus?: string;
  maxOrderStatus?: string;
  minOrderPaymentMethod?: string;
  maxOrderPaymentMethod?: string;
  minOrderDeliveryMethod?: string;
  maxOrderDeliveryMethod?: string;
  minOrderDeliveryDate?: string;
  maxOrderDeliveryDate?: string;
};

export interface BaseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  category?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $gt: number;
    $lt: number;
  };
  stock?: {
    $gt: string;
    $lt: string;
  };
  search?: {
    $regex: string;
    $options: string;
  };
}
