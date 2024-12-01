import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import mongoose from "mongoose";
export const createProducts = TryCatch(async (req, res, next) => {
    const { name, description, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Photo is required", 400));
    return next(new ErrorHandler("Product name already exist", 400));
    const data = await Product.create({
        name,
        description,
        category: category.toLocaleLowerCase(),
        price,
        photo: photo?.path,
        stock,
    });
    return res
        .status(201)
        .json({ success: true, message: "Product Created Successfully", data });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    if (!products)
        return next(new ErrorHandler("Products not found", 404));
    return res.status(200).json({ success: true, products });
});
export const getCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    if (!categories)
        return next(new ErrorHandler("Categories not found", 404));
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    if (!products)
        return next(new ErrorHandler("Products not found", 404));
    return res.status(200).json({ success: true, products });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => {
        console.log("File deleted");
    });
    await product.deleteOne();
    return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    const { name, description, category, price, stock } = req.body;
    const photo = req.file;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return next(new ErrorHandler("Invalid product ID format", 400));
    }
    const product = await Product.findById(_id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("File deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (category)
        product.category = category;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    await product.save();
    return res
        .status(200)
        .json({ success: true, message: "Product updated successfully", product });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return next(new ErrorHandler("Invalid product ID format", 400));
    }
    const product = await Product.findById(_id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    return res.status(200).json({ success: true, product });
});
export const getAllFilteredProduct = TryCatch(async (req, res, next) => {
    const { category, minPrice, maxPrice, stock, search, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limitVal = Number(process.env.PRODUCTS_PER_PAGE) || 8;
    const skip = (page - 1) * limitVal;
    const baseQuery = {};
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
});
