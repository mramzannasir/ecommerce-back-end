import express from "express";
import { createProducts, getAdminProducts, getCategories, getLatestProducts, } from "../controllers/products.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.post("/new", singleUpload, createProducts);
app.get("/latest", getLatestProducts);
app.get("/categories", getCategories);
app.get("/admin-products", getAdminProducts);
export default app;
