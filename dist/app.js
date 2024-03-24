import express from "express";
import userRoutes from "./routes/user.js";
import { errorMiddleware } from "./middlewares/error.js";
export const app = express();
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use(errorMiddleware);
// 🏘️ Home route
app.get("/", (req, res) => {
    res.send("Welcome to e-commerce backends");
});
