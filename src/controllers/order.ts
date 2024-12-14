/*************  ✨ Codeium Command 🌟  *************/
/**
 * @description Place a new order
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
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

    // Check if all fields are present
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
      // Create a new order
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

      // Reduce stock of products
      await reduceStock(orderItems);

      // Invalidate cache for orders and products
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

/**
 * @description Get all orders of a user
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const myOrders = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  // Check if orders are present in cache
  let order = [];
  console.log("yes getting", id);
  if (nodeCache.has(`orders-${id}`)) {
    order = JSON.parse(nodeCache.get(`orders-${id}`) as string);
  } else {
    // Get orders from database
    order = await Order.find({ user: id });

    // Store orders in cache
    nodeCache.set(`orders-${id}`, JSON.stringify(order));
  }

  // Check if orders are present
  if (order.length === 0)
    return next(new ErrorHandler("No orders found for this user", 404));

  return res.status(200).json({ success: true, order });
});

/******  24504598-e754-46ef-9265-4ddc14bc42e0  *******/
