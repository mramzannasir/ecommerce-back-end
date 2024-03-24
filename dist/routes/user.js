import { deleteUser, getAllUser, getUser, registerUser, } from "./../controllers/user.js";
import express from "express";
const app = express.Router();
app.post("/register", registerUser);
app.get("/all", getAllUser);
app.route("/:id").get(getUser).delete(deleteUser);
export default app;
