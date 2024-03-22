import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  photo: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  age: number;
}

const schema = new mongoose.Schema(
  {
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
        validator: (value: string) => validator.isEmail(value), 
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
  },
  {
    timestamps: true,
  }
);

schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = mongoose.model<IUser>("User", schema);
