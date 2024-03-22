import express from "express";
import { connectDB } from "./utils/connectDB.js";
import userRoutes from "./routes/user.js";
export const app = express();

app.use(express.json());
app.use("/api/v1/user", userRoutes);

// 🏘️ Home route
app.get("/", (req, res) => {
  res.send("Welcome to e-commerce backend");
});
