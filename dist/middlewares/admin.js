import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    if (!id)
        return next(new ErrorHandler("Please Login First as a admin", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("You are not found as a admin", 404));
    if (user.role !== "admin")
        return next(new ErrorHandler("You are not authorized to perform this action", 401));
    next();
});
