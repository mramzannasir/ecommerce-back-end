import express from "express";
import { createProducts, getLatestProducts } from "../controllers/products.js";
import { adminOnly } from "../middlewares/admin.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", singleUpload, createProducts);
app.get("/latest", getLatestProducts);

export default app;
