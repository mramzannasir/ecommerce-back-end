import { adminOnly } from "../middlewares/admin.js";
import {
  deleteUser,
  getAllUser,
  getUser,
  registerUser,
} from "./../controllers/user.js";
import express from "express";

const app = express.Router();

app.post("/register", registerUser);
app.get("/all", adminOnly, getAllUser);
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default app;
