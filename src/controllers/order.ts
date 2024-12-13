import { OrderItemType } from "./../types/types.js";
import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import reduceStock from "../utils/reduceStock.js";
import invalidateCache from "../utils/invalidateCache.js";
import ErrorHandler from "../utils/utility-class.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      discount,
      user,
      subTotal,
      tax,
      shippingCharges,
      total,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItems ||
      !discount ||
      !user ||
      !subTotal ||
      !tax ||
      !shippingCharges ||
      !total
    )
      return next(new ErrorHandler("Please add all felid correctly", 400));

    try {
      await Order.create({
        shippingInfo,
        orderItems,
        discount,
        user,
        subTotal,
        tax,
        shippingCharges,
        total,
      });
      await reduceStock(orderItems);
      await invalidateCache({ order: true, product: true, admin: true });
    } catch (error) {
      return next(error);
    }

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully. Thank you for shopping!",
    });
  }
);
