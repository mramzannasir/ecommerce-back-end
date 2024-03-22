import { registerUser } from "./../controllers/user.js";
import express from "express";

const app = express.Router();

app.post("/register", registerUser);

export default app;
