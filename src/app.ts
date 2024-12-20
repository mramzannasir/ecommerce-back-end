import express from "express";
import userRoutes from "./routes/user.js";
import productsRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import NodeCache from "node-cache";
import { config } from "dotenv";

export const app = express();

export const nodeCache = new NodeCache();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
config({
  path: "./.env",
});

app.get("/", (req, res) => {
  res.send("Welcome to e-commerce backends");
});
