import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQueryType,
  FilterQueryType,
  NewProductRequestBody,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import mongoose from "mongoose";
import { nodeCache } from "../app.js";
import invalidateCache from "../utils/invalidateCache.js";
/**
 * @description Create a new product
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */

export const createProducts = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, description, category, price, stock } = req.body;

    const photo = req.file;
    if (!photo) {
      return next(new ErrorHandler("Photo is required", 400));
    }

    if (await Product.findOne({ name }))
      return next(new ErrorHandler("Product already exist", 400));
    const data = await Product.create({
      name,
      description,
      category: category.toLocaleLowerCase(),
      price,
      photo: photo?.path,
      stock,
    });
    await invalidateCache({ product: true });
    return res
      .status(201)
      .json({ success: true, message: "Product Created Successfully", data });
  }
);

/**
 * @description Get all products
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("latest-products")) {
    products = JSON.parse(nodeCache.get("latest-products") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    if (!products) {
      return next(new ErrorHandler("Products not found", 404));
    }
    nodeCache.set("latest-products", JSON.stringify(products));
    if (!products) return next(new ErrorHandler("Products not found", 404));
  }
  return res.status(200).json({ success: true, products });
});

/**
 * @description Get all categories
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */

export const getCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (nodeCache.has("categories")) {
    categories = JSON.parse(nodeCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    if (!categories) return next(new ErrorHandler("Categories not found", 404));
    nodeCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

/**
 * @description Get all products for admin
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (nodeCache.has("admin-products")) {
    products = JSON.parse(nodeCache.get("admin-products") as string);
  } else {
    products = await Product.find({});
    if (!products) {
      return next(new ErrorHandler("Products not found", 404));
    }
    nodeCache.set("admin-products", JSON.stringify(products));
  }

  return res.status(200).json({ success: true, products });
});

/**
 * @description Delete a product
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const deleteProduct = TryCatch(async (req, res, next) => {
  const _id = req.params.id;
  const product = await Product.findById(_id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  if (!product) return next(new ErrorHandler("Product not found", 404));
  rm(product.photo!, () => {
    console.log("File deleted");
  });
  await product.deleteOne();
  await invalidateCache({ product: true });
  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

/**
 * @description Update a product
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const updateProduct = TryCatch(async (req, res, next) => {
  const _id = req.params.id;
  const { name, description, category, price, stock } = req.body;
  const photo = req.file;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return next(new ErrorHandler("Invalid product ID format", 400));
  }
  const product = await Product.findById(_id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  if (!product) return next(new ErrorHandler("Product not found", 404));
  if (photo) {
    rm(product.photo!, () => {
      console.log("File deleted");
    });
    product.photo = photo.path;
  }
  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  await product.save();
  await invalidateCache({ product: true });
  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully", product });
});

/**
 * @description Get a single product
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const getSingleProduct = TryCatch(async (req, res, next) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return next(new ErrorHandler("Invalid product ID format", 400));
  }
  let product;
  if (nodeCache.has(`product-${_id}`)) {
    product = JSON.parse(nodeCache.get(`product-${_id}`) as string);
  } else {
    product = await Product.findById(_id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    nodeCache.set(`product-${_id}`, JSON.stringify(product));
  }
  return res.status(200).json({ success: true, product });
});

/**
 * @description Get all filtered products
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} next - Next function
 * @returns {Promise<void>}
 */
export const getAllFilteredProduct = TryCatch(
  async (req: Request<{}, {}, FilterQueryType>, res, next) => {
    const { category, minPrice, maxPrice, stock, search, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limitVal = Number(process.env.PRODUCTS_PER_PAGE) || 8;
    const skip = (page - 1) * limitVal;

    const baseQuery: BaseQueryType = {};
    if (search) {
      baseQuery.name = {
        $regex: String(search),
        $options: "i",
      };
    }
    if (minPrice || maxPrice) {
      baseQuery.price = {
        $gt: Number(minPrice),
        $lt: Number(maxPrice),
      };
    }
    if (category) {
      baseQuery.category = {
        $regex: String(category),
        $options: "i",
      };
    }
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limitVal)
      .skip(skip);

    const [products, filteredProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredProducts.length / limitVal);
    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        limit: limitVal,
        totalProducts: products.length,
        totalPage: totalPage,
      },
    });
  }
);
