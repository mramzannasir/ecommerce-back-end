import express from "express";
import { connectDB } from "./utils/connectDB.js";
import userRoutes from "./routes/user.js";
const app = express();
connectDB();

app.use(express.json());
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to e-commerce backend");
});

app.listen(4040, () => {
  console.log("Backend is now working on port 4040");
});
