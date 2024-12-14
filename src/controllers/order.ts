import { OrderItemType } from "./../types/types.js";
import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import reduceStock from "../utils/reduceStock.js";
import invalidateCache from "../utils/invalidateCache.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

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

export const myOrders = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let order = [];
  console.log("yes getting", id);
  if (nodeCache.has(`orders-${id}`)) {
    order = JSON.parse(nodeCache.get(`orders-${id}`) as string);
  } else {
    order = await Order.find({ user: id });
    nodeCache.set(`orders-${id}`, JSON.stringify(order));
  }
  if (order.length === 0)
    return next(new ErrorHandler("No orders found for this user", 404));
  return res.status(200).json({ success: true, order });
});
