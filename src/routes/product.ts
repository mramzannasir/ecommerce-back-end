import express from "express";
import { createProducts } from "../controllers/products.js";
import { adminOnly } from "../middlewares/admin.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", singleUpload, createProducts);

export default app;
