import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
// User Register
export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, photo, _id, dob } = req.body;
    let userExist = await User.findById(_id);
    let emailExist = await User.findOne({ email });
    if (userExist || emailExist) {
        res.status(200).json({
            success: true,
            message: `User already Exist Please Login`,
        });
    }
    if (!_id || !name || !email || !password || !photo || !dob) {
        next(new ErrorHandler("Please fill all felids correctly!", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        photo,
        _id,
        dob: new Date(dob),
    });
    res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}!`,
    });
});
// Get all user
export const getAllUser = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users,
    });
});
// Get particular user
export const getUser = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user)
        return next(new ErrorHandler("User Not found", 400));
    res.status(200).json({
        success: true,
        user,
    });
});
// Delete user 🗑️
export const deleteUser = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user)
        return next(new ErrorHandler("User Not found", 400));
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
