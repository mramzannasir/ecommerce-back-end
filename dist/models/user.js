import mongoose from "mongoose";
import validator from "validator";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"],
    },
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    email: {
        type: String,
        unique: [true, "Email Already Exist"],
        required: [true, "Please Enter Email"],
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid email format",
        },
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"],
    },
    role: {
        type: String,
        required: [true, "Please enter role"],
        enum: ["admin", "user"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
    },
    dob: {
        type: Date,
        required: [true, "Please Enter Date of Birth"],
    },
}, {
    timestamps: true,
});
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
