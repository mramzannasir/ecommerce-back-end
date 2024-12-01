import express from "express";
import userRoutes from "./routes/user.js";
import productsRoutes from "./routes/product.js";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
export const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.get("/", (req, res) => {
    res.send("Welcome to e-commerce backends");
});
