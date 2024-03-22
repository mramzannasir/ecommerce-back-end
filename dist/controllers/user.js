import { User } from "../models/user.js";
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, photo, _id, dob } = req.body;
        console.log(name, email, password, photo, dob);
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
            status: 201,
            message: `User registration successful. Welcome, ${user.name}!`,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "Failed to register user. Please try again later.",
        });
    }
};
