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
