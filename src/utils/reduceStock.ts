import { NextFunction } from "express";
import { Product } from "../models/product.js";
import { OrderItemType } from "../types/types.js";
import ErrorHandler from "./utility-class.js";

const reduceStock = async (OrderItem: OrderItemType[]) => {
  for (let i = 0; i < OrderItem.length; i++) {
    const order = OrderItem[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new ErrorHandler("Product not found", 401);
    product.stock -= order.quantity;
    await product.save();
  }
};

export default reduceStock;
