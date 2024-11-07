import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Product Name"],
  },
  photo: {
    type: String,
    required: [true, "Photo is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  price: {
    type: String,
    required: [true, "Price is required"],
  },
});

export const Product = mongoose.model("Product", schema);
