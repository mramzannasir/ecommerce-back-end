/**
 * Routes for products
 */
import express from "express";
import {
  createProducts,
  getAdminProducts,
  getCategories,
  getLatestProducts,
} from "../controllers/products.js";
import { adminOnly } from "../middlewares/admin.js";
import { singleUpload } from "../middlewares/multer.js";

/**
 * Router for products
 */
const app = express.Router();

/**
 * POST /products/new
 * Create a new product
 */
app.post("/new", singleUpload, createProducts);

/**
 * GET /products/latest
 * Get the latest products
 */
app.get("/latest", getLatestProducts);

/**
 * GET /products/categories
 * Get all categories
 */
app.get("/categories", getCategories);

/**
 * GET /products/admin-products
 * Get all products for admin
 */
app.get("/admin-products/:id", adminOnly, getAdminProducts);

export default app;
