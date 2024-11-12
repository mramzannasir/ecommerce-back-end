import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
export const createProducts = TryCatch(async (req, res, next) => {
    const { name, description, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Photo is required", 400));
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
